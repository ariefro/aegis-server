import { Op } from 'sequelize';
import { Income, Expense, Transfer } from '../constants';
import { Transaction } from '../models';
import slugToType from '../utils/slugToType';

class TransactionService {
  static getTransactions = async (id) => Transaction.findAll({
    where: {
      [Op.or]: [
        { to_wallet_id: id },
        { wallet_id: id },
      ],
    },
  });

  static getTransactionByID = async (id) => Transaction.findOne({
    where: {
      id,
    },
  });

  static addTransaction = async ({
    walletID,
    toWalletID,
    slug,
    currency,
    name,
    amount,
  }) => {
    const type = slugToType(slug);

    const transaction = Transaction.create({
      type,
      slug,
      name,
      amount,
      currency,
      wallet_id: walletID,
      to_wallet_id: toWalletID,
    });

    return transaction;
  };

  static updateTransaction = async (id, {
    walletId,
    toWalletId,
    note,
    amount,
    currency,
    type,
  }) => Transaction.update(
    {
      wallet_id: walletId,
      to_wallet_id: toWalletId,
      note,
      amount,
      currency,
      type,
    },
    {
      where: { id },
    },
  );

  static getTransactionsByType = async (typeTransaction, id) => Transaction.findAll({
    where: {
      type: typeTransaction,
      [Op.and]: { wallet_id: id },
    },
  });

  static getTotalTransactionsByType = async (walletID, transactions) => {
    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
      const { amount } = transaction.dataValues;
      if (transaction.dataValues.type === Income) {
        income += amount;
      } else if (transaction.dataValues.type === Expense) {
        expense += amount;
      } else if (transaction.dataValues.type === Transfer) {
        if (transaction.dataValues.wallet_id === walletID) {
          expense += amount;
        } else if (transaction.dataValues.to_wallet_id === walletID) {
          income += amount;
        }
      }
    });

    return { income, expense };
  };

  static deleteTransaction = async (transaction) => {
    transaction.destroy();
  };
}

export default TransactionService;
