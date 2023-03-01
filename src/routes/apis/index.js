import express from 'express';
import UserController from '../../controllers/user-controller';
import Routes from '../../constants/routes';
import Services from '../../constants/services';
import Middleware from '../../middlewares';
import WalletController from '../../controllers/wallet-controller';
import TransactionController from '../../controllers/transaction-controller';
import LogController from '../../controllers/log-controller';

const router = express.Router();
const {
  validate,
  validationRules,
  validateRefreshToken,
} = require('../../middlewares/validator');

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
router.post(Routes.Token, validateRefreshToken, UserController.refreshToken);
router.post(Routes.Logout, validateRefreshToken, UserController.logout);
router.get(Routes.Users, [Middleware.Auth], UserController.getUsers);

router.post(
  Routes.Wallet,
  [validationRules(Services.AddWallet), validate, Middleware.Auth],
  WalletController.addWallet,
);
router.get(
  Routes.WalletID,
  [Middleware.Auth],
  WalletController.getDetailOfWallet,
);
router.get(Routes.Wallets, [Middleware.Auth], WalletController.getWallets);
router.get(
  Routes.WalletDetail,
  [Middleware.Auth],
  WalletController.getWalletByID,
);
router.get(
  Routes.WalletsToTransfer,
  [Middleware.Auth],
  WalletController.getWalletsToTransfer,
);
router.delete(
  Routes.WalletID,
  [validationRules(Services.DeleteWallet), validate, Middleware.Auth],
  WalletController.deleteWallet,
);
router.put(
  Routes.WalletID,
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

router.get(
  Routes.Logs,
  [Middleware.Auth],
  LogController.getLogs,
);

export default router;
