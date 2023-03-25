/* eslint-disable max-len */
import { Op, Sequelize } from 'sequelize';
import { Income, Expense, Transfer } from '../constants';
import { Wallet, CashFlow } from '../models';
import slugToType from '../utils/slugToType';

class WalletService {
  static getWallets = async (id) => Wallet.findAll({
    where: {
      user_id: id,
    },
    attributes: { exclude: ['cash_flow_id', 'user_id', 'status', 'currency', 'balance', 'created_at', 'updated_at'] },
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

  static getOtherWallets = async (
    userId,
    walletId,
  ) => Wallet.findAll({
    where: {
      user_id: userId,
      id: {
        [Op.not]: walletId,
      },
    },
    attributes: { exclude: ['user_id', 'balance', 'cash_flow_id', 'status', 'currency', 'created_at', 'updated_at'] },
  });

  static addWallet = async ({
    name,
    balance,
    currency,
    userID,
    cashFlowID,
    transaction,
  }) => Wallet.create({
    name,
    balance,
    currency,
    user_id: userID,
    cash_flow_id: cashFlowID,
  }, { transaction });

  static updateWalletBalance = async ({
    walletID, toWalletID, amount, generatedSlug, transaction,
  }) => {
    const type = slugToType(generatedSlug);

    let balanceUpdate;
    if (type === Expense) {
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: walletID }, transaction });
    } else if (type === Income) {
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: walletID }, transaction });
    } else if (type === Transfer) {
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: toWalletID }, transaction });
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: walletID }, transaction });
    }

    return balanceUpdate;
  };

  static revertWalletBalance = async ({
    walletID, destinationTransferID, amount, type, transaction,
  }) => {
    let balanceUpdate;
    if (type === Expense) {
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: walletID }, transaction });
    } else if (type === Income) {
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: walletID }, transaction });
    } else if (type === Transfer) {
      balanceUpdate = await Wallet.decrement({ balance: amount }, { where: { id: destinationTransferID }, transaction });
      balanceUpdate = await Wallet.increment({ balance: amount }, { where: { id: walletID }, transaction });
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
      updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    {
      where: { id },
    },
  );

  static updateCashFlowWallet = async (
    id,
    cashFlowID,
  ) => {
    const wallet = Wallet.update(
      {
        cash_flow_id: cashFlowID,
      },
      {
        where: { id },
      },
    );

    return wallet;
  };
}

export default WalletService;
