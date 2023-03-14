/* eslint-disable no-param-reassign */
import { Op } from 'sequelize';
import {
  Income, Expense, Transfer, DummyDate, TopUp,
} from '../constants';
import { Transaction } from '../models';
import slugToType from '../utils/slugToType';

class TransactionService {
  static getTransactions = async (id, {
    limit,
    page,
    start_date: startDate,
    end_date: endDate,
  }) => {
    const where = {};
    let offset = 0;

    if (!limit) {
      limit = 15;
    }

    if (!startDate) {
      startDate = DummyDate;
    }

    if (!endDate) {
      endDate = new Date();
    }

    if (id) {
      Object.assign(where, {
        [Op.or]: [
          { to_wallet_id: id },
          { wallet_id: id },
        ],
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      });
    }

    if (page) {
      offset = (page - 1) * limit;
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      limit,
      offset,
    });

    rows.forEach((transaction) => {
      if (transaction.dataValues.slug === Transfer && transaction.dataValues.to_wallet_id === id) {
        transaction.dataValues.amount *= 1;
      } else if (transaction.dataValues.slug !== TopUp) {
        transaction.dataValues.amount *= -1;
      }
    });

    return { rows, count };
  };

  static getTransactionByID = async (id) => Transaction.findOne({
    where: {
      id,
    },
  });

  static addTransaction = async ({
    walletID,
    toWalletID,
    generatedSlug,
    currency,
    name,
    amount,
  }) => {
    const type = slugToType(generatedSlug);

    const transaction = Transaction.create({
      type,
      slug: generatedSlug,
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

    transactions.rows.forEach((transaction) => {
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
