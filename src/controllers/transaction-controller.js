import { sequelize } from '../models';
import WalletService from '../services/wallet-service';
import TransactionService from '../services/transaction-service';
import BaseController from './base-controller';
import Errors from '../constants/errors';
import { Transfer } from '../constants';
import createNotificationMessage from '../utils/notificationMessage';
import slugToType from '../utils/slugToType';
import LogService from '../services/log-service';
import generateSlug from '../utils/generateSlug';

class TransactionController extends BaseController {
  static getTransactionsByWalletID = async (req, res) => {
    try {
      const { id } = req.params;
      const { query } = req;

      const transactions = await TransactionService.getTransactions(id, query);

      return res.send({
        transactions,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static addTransaction = async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        const userID = req.decoded.id;
        const {
          slug, currency, amount, name, wallet_id: walletID, to_wallet_id: toWalletID,
        } = req.body;

        const wallet = await WalletService.getWalletByID(userID, walletID);
        if (!wallet) {
          throw new Error(Errors.WalletNotFound);
        }

        let destinationTransfer;
        if (slug === Transfer) {
          destinationTransfer = await WalletService.getWalletByID(userID, toWalletID);
          if (!destinationTransfer) {
            throw new Error(Errors.DestinationTransferNotFound);
          }
        }

        const generatedSlug = generateSlug(slug);

        const transaction = await TransactionService.addTransaction({
          generatedSlug,
          name,
          currency,
          amount,
          walletID,
          toWalletID,
          t,
        });
        if (!transaction) {
          throw new Error(Errors.FailedToCreateTransaction);
        }

        await WalletService.updateWalletBalance({
          walletID,
          toWalletID,
          amount,
          generatedSlug,
          t,
        });

        let message;
        if (destinationTransfer !== undefined) {
          message = createNotificationMessage(
            generatedSlug,
            amount,
            wallet.dataValues.name,
            destinationTransfer.dataValues.name,
            name,
          );
        } else {
          message = createNotificationMessage(
            generatedSlug,
            amount,
            wallet.dataValues.name,
            undefined,
            name,
          );
        }

        const type = slugToType(generatedSlug);

        await LogService.createLog(
          userID,
          walletID,
          toWalletID,
          transaction.dataValues.id,
          wallet.dataValues.name,
          generatedSlug,
          type,
          message,
          t,
        );
      });

      return res.send(this.responseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static updateTransaction = async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        const { id } = req.params;
        const userID = req.decoded.id;
        const {
          slug, currency, amount, name, wallet_id: walletID, to_wallet_id: toWalletID,
        } = req.body;

        const transaction = await TransactionService.getTransactionByID(id);
        if (!transaction) {
          throw new Error(Errors.TransactionNotFound);
        }

        const wallet = await WalletService.getWalletByID(userID, walletID);
        if (!wallet) {
          throw new Error(Errors.WalletNotFound);
        }

        const {
          wallet_id: walletIDOfTransaction,
          to_wallet_id: destinationTransferIDOfTransaction,
          amount: amountOfTransaction,
          type: typeOfTransaction,
        } = transaction.dataValues;

        let destinationTransfer;
        if (slug === Transfer) {
          destinationTransfer = await WalletService.getWalletByID(userID, toWalletID);
          if (!destinationTransfer) {
            throw new Error(Errors.DestinationTransferNotFound);
          }
        }

        const generatedSlug = generateSlug(slug);
        const type = slugToType(generatedSlug);

        await TransactionService.updateTransaction(id, {
          walletID,
          toWalletID,
          name,
          amount,
          currency,
          generatedSlug,
          type,
          t,
        });

        await WalletService.revertWalletBalance({
          walletID: walletIDOfTransaction,
          destinationTransferID: destinationTransferIDOfTransaction,
          amount: amountOfTransaction,
          type: typeOfTransaction,
          t,
        });

        await WalletService.updateWalletBalance({
          walletID,
          toWalletID,
          amount,
          generatedSlug,
          t,
        });

        let message;
        if (destinationTransfer !== undefined) {
          message = createNotificationMessage(
            generatedSlug,
            amount,
            wallet.dataValues.name,
            destinationTransfer.dataValues.name,
            name,
          );
        } else {
          message = createNotificationMessage(
            generatedSlug,
            amount,
            wallet.dataValues.name,
            undefined,
            name,
          );
        }

        await LogService.updateLog(
          transaction.dataValues.id,
          {
            walletID,
            toWalletID,
            name: wallet.dataValues.name,
            generatedSlug,
            type,
            message,
            t,
          },
        );
      });

      return res.send(this.responseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static deleteTransaction = async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        const { id } = req.params;

        const transaction = await TransactionService.getTransactionByID(id);
        if (!transaction) {
          throw new Error(Errors.TransactionNotFound);
        }

        const {
          wallet_id: walletID,
          to_wallet_id: destinationTransferID,
          amount,
          type,
        } = transaction.dataValues;

        await WalletService.revertWalletBalance({
          walletID,
          destinationTransferID,
          amount,
          type,
          t,
        });

        await TransactionService.deleteTransaction(transaction, { t });
      });

      return res.send(this.responseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };
}
export default TransactionController;
