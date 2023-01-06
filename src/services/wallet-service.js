import { Op } from 'sequelize';
import constants from '../constants';
import { Wallet, CashFlow } from '../models';

class WalletService {
  static getWallets = async (id) => Wallet.findAll({
    where: {
      user_id: id,
    },
    attributes: { exclude: ['cash_flow_id', 'user_id'] },
  });

  static getWalletByID = async (userId, id) => Wallet.findOne({
    where: {
      user_id: userId,
      [Op.and]: { id },
    },
    attributes: { exclude: ['user_id'] },
    include: [
      {
        model: CashFlow,
        as: 'total',
        attributes: ['income', 'expense'],
      },
    ],
  });

  static getOtherWalletByCurrency = async (
    userId,
    currency,
    walletId,
  ) => Wallet.findAll({
    where: {
      user_id: userId,
      [Op.and]: { currency },
      id: {
        [Op.not]: walletId,
      },
    },
  });

  static addWallet = async ({
    name,
    balance,
    currency,
    userID,
    cashFlowID,
  }) => Wallet.create({
    name,
    balance,
    currency,
    user_id: userID,
    cash_flow_id: cashFlowID,
  });

  static updateWalletBalance = async ({
    walletId, toWalletId, amount, type,
  }) => {
    let balanceUpdate;
    if (type === constants.Expense) {
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: walletId } });
    } else if (type === constants.Income) {
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: walletId } });
    } else if (type === constants.Transfer) {
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: toWalletId } });
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: walletId } });
    }

    return balanceUpdate;
  };

  static revertWalletBalance = async ({
    walletId, toWalletId, amount, type,
  }) => {
    let balanceUpdate;
    if (type === constants.Expense) {
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: walletId } });
    } else if (type === constants.Income) {
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: walletId } });
    } else if (type === constants.Transfer) {
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: toWalletId } });
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: walletId } });
    }

    return balanceUpdate;
  };

  static deleteWallet = async (wallet) => {
    wallet.destroy();
  };

  static updateWallet = async (id, {
    name,
    status,
    balance,
    currency,
  }) => Wallet.update(
    {
      name,
      status,
      balance,
      currency,
    },
    {
      where: { id },
    },
  );
}

export default WalletService;
