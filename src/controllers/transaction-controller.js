import WalletService from '../services/wallet-service';
import TransactionService from '../services/transaction-service';
import BaseController from './base-controller';
import Errors from '../constants/errors';
import constants from '../constants';

class TransactionController extends BaseController {
  static getTransactionsByWalletID = async (req, res) => {
    try {
      const { id } = req.params;

      const transactions = await TransactionService.getTransactions(id);

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
      const userId = req.decoded.id;
      const {
        slug, currency, amount, note, wallet_id: walletId, to_wallet_id: toWalletId,
      } = req.body;

      const wallet = await WalletService.getWalletByID(userId, walletId);
      if (!wallet) {
        throw new Error(Errors.WalletNotFound);
      }

      if (slug === constants.Transfer) {
        if (!toWalletId) {
          throw new Error(Errors.DestinationWalletEmpty);
        }

        const destinationWallet = await WalletService.getWalletByID(userId, toWalletId);
        if (!destinationWallet) {
          throw new Error(Errors.DestinationWalletNotFound);
        }
      }

      const transaction = await TransactionService.addTransaction({
        slug,
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
        slug,
      });

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

  // static getTotalIncome = async (req, res) => {
  //   try {
  //     const { id } = req.params;

  //     const incomeTransactions = await TransactionService.getTransactionsByType('income', id);
  //     const total = await TransactionService.getTotalAmountOfTransactions(incomeTransactions);
  //     console.log('====>', total);

  //     return res.send(this.reponseSuccess(total));
  //   } catch (err) {
  //     const error = this.getError(err);

  //     return res.status(error.code).send({ message: error.message });
  //   }
  // };
}
export default TransactionController;
