import Errors from '../constants/errors';
import CashFlowService from '../services/cash-flow-service';
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

      const transactions = await TransactionService.getTransactions(id);
      const { income, expense } = await
      TransactionService.getTotalTransactionsByType(id, transactions);

      let wallet = await WalletService.getWalletByID(userID, id);
      if (!wallet) {
        throw new Error(Errors.WalletNotFound);
      }

      let { cash_flow_id: cashFlowID } = wallet.dataValues;
      if (cashFlowID == null) {
        const cashFlow = await CashFlowService.addCashFlow();
        cashFlowID = cashFlow.dataValues.id;
        await CashFlowService.updateCashFlow(cashFlowID, income, expense);
        wallet = await WalletService.getWalletByID(userID, id);

        return res.send(wallet);
      }

      await CashFlowService.updateCashFlow(cashFlowID, income, expense);

      wallet = await WalletService.getWalletByID(userID, id);

      const {
        name, status, currency, balance, total, created_at,
      } = wallet.dataValues;

      return res.send({
        name, status, currency, balance, total, created_at,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static addWallet = async (req, res) => {
    try {
      const { name, balance, currency } = req.body;
      const { id: userID } = req.decoded;

      const cashFlow = await CashFlowService.addCashFlow();
      const cashFlowID = cashFlow.dataValues.id;
      await WalletService.addWallet({
        name,
        balance,
        currency,
        userID,
        cashFlowID,
      });

      return res.send(this.reponseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static getDetailOfWallet = async (req, res) => {
    try {
      const userID = req.decoded.id;
      const { id } = req.params;

      const wallet = await WalletService.getWalletByID(userID, id);
      if (!wallet) {
        throw new Error(Errors.WalletNotFound);
      }

      const wallets = await WalletService.getOtherWallets(userID, id);

      const transactions = await TransactionService.getTransactions(id);
      const {
        id: wallet_id, name, currency, balance,
      } = wallet.dataValues;

      return res.send({
        wallet_id, name, currency, balance, wallets, transactions,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static deleteWallet = async (req, res) => {
    try {
      const userId = req.decoded.id;
      const { id } = req.params;

      const wallets = await WalletService.getWallets(userId);
      if (wallets.length <= 1) {
        throw new Error(Errors.UnableToDeleteWallet);
      }

      const wallet = await WalletService.getWalletByID(userId, id);
      if (!wallet) {
        throw new Error(Errors.WalletNotFound);
      }

      await WalletService.deleteWallet(wallet);

      return res.send(this.reponseSuccess());
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

      return res.send(this.reponseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static getWalletsToTransfer = async (req, res) => {
    try {
      const owner = req.decoded.id;
      const { wallet_id: walletID } = req.body;

      const wallets = await WalletService.getOtherWalletsToTransfer(owner, walletID);

      return res.send({ wallets });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };
}

export default WalletController;
