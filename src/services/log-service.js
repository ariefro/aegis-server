import { Op, Sequelize } from 'sequelize';
import { Transfer } from '../constants';
import { Log } from '../models';

class LogService {
  static createLog = async (
    userID,
    walletID,
    toWalletID,
    transactionID,
    name,
    slug,
    type,
    message,
    transaction,
  ) => Log.create({
    user_id: userID,
    wallet_id: walletID,
    to_wallet_id: toWalletID,
    transaction_id: transactionID,
    name,
    slug,
    type,
    message,
  }, { transaction });

  static updateLog = async (transactionID, {
    walletID,
    toWalletID,
    name,
    generatedSlug,
    type,
    message,
    transaction,
  }) => Log.update(
    {
      wallet_id: walletID,
      to_wallet_id: toWalletID,
      name,
      slug: generatedSlug,
      type,
      message,
      updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    {
      where: { transaction_id: transactionID },
      transaction,
    },
  );

  static getLogs = async (id) => Log.findAll({
    where: {
      user_id: id,
      [Op.and]: [
        {
          transaction_id: {
            [Op.ne]: null,
          },
        },
      ],
      [Op.or]: [
        {
          wallet_id: {
            [Op.ne]: null,
          },
        },
        {
          to_wallet_id: {
            [Op.ne]: null,
          },
        },
      ],
    },
    order: [['created_at', 'DESC']],
    attributes: { exclude: ['user_id', 'wallet_id', 'to_wallet_id', 'transaction_id', 'slug'] },
  });

  static updateLogMessage = async (walletID, { transaction }) => {
    let result = await Log.update(
      {
        message: Sequelize.fn('replace', Sequelize.col('message'), 'to', '(wallet removed) to'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),

      },
      {
        where: {
          [Op.and]: [
            { wallet_id: walletID },
            { type: Transfer },
          ],
        },
        transaction,
      },
    );

    result = await Log.update(
      {
        message: Sequelize.fn('replace', Sequelize.col('message'), 'for', '(wallet removed) for'),
      },
      {
        where: {
          [Op.and]: [
            { to_wallet_id: walletID },
            { type: Transfer },
          ],
        },
        transaction,
      },
    );

    return result;
  };
}

export default LogService;
