import express from 'express';
import UserController from '../../controllers/user-controller';
import Routes from '../../constants/routes';
import Services from '../../constants/services';
import Middleware from '../../middlewares';
import WalletController from '../../controllers/wallet-controller';
import TransactionController from '../../controllers/transaction-controller';

const router = express.Router();
const { validate, validationRules } = require('../../middlewares/validator');

router.post(
  Routes.Register,
  [validationRules(Services.RegisterUser), validate, Middleware.Guest],
  UserController.registerUser,
);
router.post(
  Routes.Login,
  [validationRules(Services.Login), validate, Middleware.Guest],
  UserController.login,
);
router.get(Routes.Users, [Middleware.Auth], UserController.getUsers);

router.post(
  Routes.Wallet,
  [validationRules(Services.AddWallet), validate, Middleware.Auth],
  WalletController.addWallet,
);
router.get(Routes.WalletID, [Middleware.Auth], WalletController.getDetailOfWallet);
router.get(Routes.Wallets, [Middleware.Auth], WalletController.getWallets);
router.get(Routes.WalletDetail, [Middleware.Auth], WalletController.getWalletByID);
router.get(Routes.WalletsToTransfer, [Middleware.Auth], WalletController.getWalletsToTransfer);
router.delete(
  Routes.WalletId,
  [validationRules(Services.DeleteWallet), validate, Middleware.Auth],
  WalletController.deleteWallet,
);
router.put(
  Routes.WalletId,
  [validationRules(Services.UpdateWallet), validate, Middleware.Auth],
  WalletController.updateWallet,
);

router.post(
  Routes.Transaction,
  [validationRules(Services.AddTransaction), validate, Middleware.Auth],
  TransactionController.addTransaction,
);
router.get(
  Routes.TransactionId,
  [Middleware.Auth],
  TransactionController.getTransactionsByWalletID,
);
router.put(
  Routes.TransactionId,
  [validationRules(Services.UpdateTransaction), validate, Middleware.Auth],
  TransactionController.updateTransaction,
);
router.delete(
  Routes.TransactionId,
  [validationRules(Services.DeleteTransaction), validate, Middleware.Auth],
  TransactionController.deleteTransaction,
);

export default router;
