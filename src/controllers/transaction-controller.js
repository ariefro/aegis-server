import WalletService from '../services/wallet-service';
import TransactionService from '../services/transaction-service';
import BaseController from './base-controller';
import Errors from '../constants/errors';
import { Transfer } from '../constants';
import createNotificationMessage from '../utils/notificationMessage';
import slugToType from '../utils/slugToType';
import LogService from '../services/log-service';

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

      let destinationWallet;
      if (slug === Transfer) {
        if (!toWalletID) {
          throw new Error(Errors.DestinationWalletEmpty);
        }

        destinationWallet = await WalletService.getWalletByID(userID, toWalletID);
        if (!destinationWallet) {
          throw new Error(Errors.DestinationWalletNotFound);
        }
      }

      const transaction = await TransactionService.addTransaction({
        slug,
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
        slug,
      });

      const message = createNotificationMessage(
        slug,
        amount,
        wallet.dataValues.name,
        destinationWallet.dataValues.name,
        name,
      );

      const type = slugToType(slug);

      await LogService.createLog(userID, slug, type, message);

      return res.send(this.reponseSuccess());
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
          throw new Error(Errors.DestinationWalletEmpty);
        }

        const destinationWallet = await WalletService.getWalletByID(userId, toWalletId);
        if (!destinationWallet) {
          throw new Error(Errors.DestinationWalletNotFound);
        }
      }

      return res.send(this.reponseSuccess());
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
        to_wallet_id: destinationWalletId,
        amount,
        type,
      } = transaction.dataValues;

      await WalletService.revertWalletBalance({
        walletId,
        destinationWalletId,
        amount,
        type,
      });

      await TransactionService.deleteTransaction(transaction);

      return res.send(this.reponseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };
}
export default TransactionController;
