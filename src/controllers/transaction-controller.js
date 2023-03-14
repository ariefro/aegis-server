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
      });
      if (!transaction) {
        throw new Error(Errors.FailedToCreateTransaction);
      }

      await WalletService.updateWalletBalance({
        walletID,
        toWalletID,
        amount,
        generatedSlug,
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

      await LogService.createLog(userID, wallet.dataValues.name, generatedSlug, type, message);

      return res.send(this.responseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static updateTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      const {
        type, currency, amount, note, wallet_id: walletId, to_wallet_id: toWalletId,
      } = req.body;

      const transaction = await TransactionService.getTransactionByID(id);
      if (!transaction) {
        throw new Error(Errors.TransactionNotFound);
      }

      await TransactionService.updateTransaction(id, {
        walletId,
        toWalletId,
        note,
        amount,
        currency,
        type,
      });

      if (type === Transfer) {
        if (!toWalletId) {
          throw new Error(Errors.DestinationTransferEmpty);
        }

        const destinationTransfer = await WalletService.getWalletByID(userId, toWalletId);
        if (!destinationTransfer) {
          throw new Error(Errors.DestinationTransferNotFound);
        }
      }

      return res.send(this.responseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static deleteTransaction = async (req, res) => {
    try {
      const { id } = req.params;

      const transaction = await TransactionService.getTransactionByID(id);
      if (!transaction) {
        throw new Error(Errors.TransactionNotFound);
      }

      const {
        wallet_id: walletId,
        to_wallet_id: destinationTransferId,
        amount,
        type,
      } = transaction.dataValues;

      await WalletService.revertWalletBalance({
        walletId,
        destinationTransferId,
        amount,
        type,
      });

      await TransactionService.deleteTransaction(transaction);

      return res.send(this.responseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };
}
export default TransactionController;
