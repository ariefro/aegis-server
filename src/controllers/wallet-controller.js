import { sequelize } from '../models';
import { Success } from '../constants';
import Errors from '../constants/errors';
import CashFlowService from '../services/cash-flow-service';
import LogService from '../services/log-service';
import TransactionService from '../services/transaction-service';
import WalletService from '../services/wallet-service';
import BaseController from './base-controller';

class WalletController extends BaseController {
  static getWallets = async (req, res) => {
    try {
      const owner = req.decoded.id;

      const wallets = await WalletService.getWallets(owner);

      return res.send({ wallets });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static getWalletByID = async (req, res) => {
    try {
      const userID = req.decoded.id;
      const { id } = req.params;
      const { query } = req;

      const transactions = await TransactionService.getTransactions(id, query);
      const { income, expense } = await
      TransactionService.getTotalTransactionsByType(id, transactions);

      let wallet = await WalletService.getWalletByID(userID, id);
      if (!wallet) {
        throw new Error(Errors.WalletNotFound);
      }

      const { cash_flow_id: cashFlowID } = wallet.dataValues;
      await CashFlowService.updateCashFlow(cashFlowID, income, expense);

      wallet = await WalletService.getWalletByID(userID, id);

      const {
        name, status, currency, balance, total, created_at, updated_at,
      } = wallet.dataValues;

      return res.send({
        name, status, currency, balance, total, created_at, updated_at,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static addWallet = async (req, res) => {
    try {
      let wallet;
      await sequelize.transaction(async (transaction) => {
        const { name, balance, currency } = req.body;
        const { id: userID } = req.decoded;

        const wallets = await WalletService.getWallets(userID);
        if (wallets.length === 6) {
          throw new Error(Errors.UnableToAddWallet);
        }

        const cashFlow = await CashFlowService.addCashFlow({ transaction });
        const cashFlowID = cashFlow.dataValues.id;
        wallet = await WalletService.addWallet({
          name,
          balance,
          currency,
          userID,
          cashFlowID,
          transaction,
        });
      });

      return res.send({
        message: Success,
        wallet_id: wallet.id,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static getDetailOfWallet = async (req, res) => {
    try {
      const userID = req.decoded.id;
      const { id } = req.params;
      const { query } = req;

      const wallet = await WalletService.getWalletByID(userID, id);
      if (!wallet) {
        throw new Error(Errors.WalletNotFound);
      }

      const wallets = await WalletService.getWallets(userID, id);

      const { rows: transactions, count: total_of_transaction } = await
      TransactionService.getTransactions(id, query);
      const {
        id: wallet_id, name, currency, balance,
      } = wallet.dataValues;

      return res.send({
        wallet_id,
        name,
        currency,
        balance,
        wallets,
        transactions,
        total_of_transaction,
        size: query.limit,
        page: query.page,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static deleteWallet = async (req, res) => {
    try {
      let userId;
      let wallets;

      await sequelize.transaction(async (transaction) => {
        userId = req.decoded.id;
        const { id } = req.params;

        wallets = await WalletService.getWallets(userId);
        if (wallets.length <= 1) {
          throw new Error(Errors.UnableToDeleteWallet);
        }

        const wallet = await WalletService.getWalletByID(userId, id);
        if (!wallet) {
          throw new Error(Errors.WalletNotFound);
        }

        await LogService.updateLogMessage(id, { transaction });
        await WalletService.deleteWallet(wallet, { transaction });
      });

      wallets = await WalletService.getWallets(userId);

      return res.send({ message: Success, wallets });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static updateWallet = async (req, res) => {
    try {
      const {
        name, status, balance, currency,
      } = req.body;
      const { id } = req.params;
      const userId = req.decoded.id;

      const currentWallet = await WalletService.getWalletByID(userId, id);
      if (!currentWallet) {
        throw new Error(Errors.WalletNotFound);
      }

      await WalletService.updateWallet(id, {
        name,
        status,
        balance,
        currency,
      });

      return res.send(this.responseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static getWalletsToTransfer = async (req, res) => {
    try {
      const owner = req.decoded.id;
      const { id: walletID } = req.params;

      const wallets = await WalletService.getOtherWallets(owner, walletID);

      return res.send({ wallets });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };
}

export default WalletController;
