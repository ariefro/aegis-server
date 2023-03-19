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
  ) => Log.create({
    user_id: userID,
    wallet_id: walletID,
    to_wallet_id: toWalletID,
    transaction_id: transactionID,
    name,
    slug,
    type,
    message,
  });

  static updateLog = async (transactionID, {
    walletID,
    toWalletID,
    name,
    generatedSlug,
    type,
    message,
  }) => Log.update(
    {
      wallet_id: walletID,
      to_wallet_id: toWalletID,
      name,
      slug: generatedSlug,
      type,
      message,
    },
    {
      where: { transaction_id: transactionID },
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
    attributes: { exclude: ['user_id', 'transaction_id', 'slug'] },
  });

  static updateLogMessage = async (walletID) => {
    let result = await Log.update(
      {
        message: Sequelize.fn('replace', Sequelize.col('message'), 'to', '(wallet removed) to'),
      },
      {
        where: {
          [Op.and]: [
            { wallet_id: walletID },
            { type: Transfer },
          ],
        },
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
      },
    );

    return result;
  };
}

export default LogService;
