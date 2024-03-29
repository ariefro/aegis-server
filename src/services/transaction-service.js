/* eslint-disable no-param-reassign */
import { Op, Sequelize } from 'sequelize';
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
      order: [['created_at', 'DESC']],
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
    t,
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
    }, { transaction: t });

    return transaction;
  };

  static updateTransaction = async (id, {
    walletID,
    toWalletID,
    name,
    amount,
    currency,
    generatedSlug,
    type,
    transaction,
  }) => {
    let result;
    if (generatedSlug === Transfer && toWalletID) {
      result = Transaction.update(
        {
          wallet_id: walletID,
          to_wallet_id: toWalletID,
          name,
          amount,
          currency,
          slug: generatedSlug,
          type,
          updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {
          where: { id },
          transaction,
        },
      );
    } else {
      result = Transaction.update(
        {
          wallet_id: walletID,
          name,
          amount,
          currency,
          slug: generatedSlug,
          type,
          updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        {
          where: { id },
          transaction,
        },
      );
    }

    return result;
  };

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

  static deleteTransaction = async (transaction, { t }) => {
    await transaction.destroy({ transaction: t });
  };
}

export default TransactionService;
