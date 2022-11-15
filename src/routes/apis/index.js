import express from 'express';
import UserController from '../../controllers/user-controller';
import Routes from '../../constants/routes';
import Services from '../../constants/services';
import Middleware from '../../middlewares';
import WalletController from '../../controllers/wallet-controller';
// import TransactionController from '../../controllers/transaction-controller';
// import TransferController from '../../controllers/transfer-controller';

const router = express.Router();
const { validate, validationRules } = require('../../middlewares/validator');

router.post(Routes.Register, [
  validationRules(Services.RegisterUser), validate, Middleware.Guest], UserController.registerUser);
router.post(Routes.Login, [
  validationRules(Services.Login), validate, Middleware.Guest], UserController.login);
router.post(Routes.Logout, UserController.logout);
router.get(Routes.Users, [Middleware.Auth], UserController.getUsers);

router.post(Routes.Wallet, [
  validationRules(Services.AddWallet), validate, Middleware.Auth], WalletController.addWallet);
router.get(Routes.Wallets, [Middleware.Auth], WalletController.getWallets);
router.delete(Routes.WalletId, [
  validationRules(Services.DeleteWallet), validate, Middleware.Auth,
], WalletController.deleteWallet);

// router.post(Routes.Transaction, [Middleware.Auth], TransactionController.addTransaction);
// router.get(Routes.TransactionId, [Middleware.Auth], TransactionController.getTransactions);

// router.post(Routes.Transfer, [Middleware.Auth], TransferController.addTransfer);
// router.get(Routes.TransferId, [Middleware.Auth], TransferController.getTransfers);

export default router;
