import { Op } from 'sequelize';
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
    attributes: { exclude: ['id', 'user_id', 'wallet_id', 'to_wallet_id', 'transaction_id', 'slug'] },
  });
}

export default LogService;
