import WalletService from '../services/wallet-service';
import TransactionService from '../services/transaction-service';
import BaseController from './base-controller';
import Errors from '../constants/errors';
import constants from '../constants';

class TransactionController extends BaseController {
  static getTransactionsByWalletID = async (req, res) => {
    try {
      const { id } = req.params;

      const transaction = await TransactionService.getTransactions(id);

      return res.send(this.reponseSuccess(transaction));
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send(error);
    }
  };

  static addTransaction = async (req, res) => {
    try {
      const userId = req.decoded.id;
      const {
        type, currency, amount, note, wallet_id: walletId, to_wallet_id: toWalletId,
      } = req.body;

      const wallet = await WalletService.getWalletByID(userId, walletId);
      if (!wallet) {
        throw new Error(Errors.WalletNotFound);
      }

      if (type === constants.Transfer) {
        if (!toWalletId) {
          throw new Error(Errors.DestinationWalletEmpty);
        }

        const destinationWallet = await WalletService.getWalletByID(userId, toWalletId);
        if (!destinationWallet) {
          throw new Error(Errors.DestinationWalletNotFound);
        }
      }

      const transaction = await TransactionService.addTransaction({
        type,
        note,
        currency,
        amount,
        walletId,
        toWalletId,
      });
      if (!transaction) {
        throw new Error(Errors.FailedToCreateTransaction);
      }

      await WalletService.updateWalletBalance({
        walletId,
        toWalletId,
        amount,
        type,
      });

      return res.send(this.reponseSuccess(transaction));
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send(error);
    }
  };

  static updateTransaction = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.decoded.id;
      const {
        type, currency, amount, note, wallet_id: walletId, to_wallet_id: toWalletId,
      } = req.body;

      const transaction = await TransactionService.getTransactionByID(userId, id);
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

      if (type === constants.Transfer) {
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

      return res.status(error.code).send(error);
    }
  };
}
export default TransactionController;
