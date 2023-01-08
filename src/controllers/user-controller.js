import constants from '../constants';
import Errors from '../constants/errors';
import CashFlowService from '../services/cash-flow-service';
import UserService from '../services/user-service';
import WalletService from '../services/wallet-service';
import BaseController from './base-controller';

class UserController extends BaseController {
  static getUsers = async (req, res) => {
    try {
      const users = await UserService.getUsers();

      return res.send({
        users,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      let user = await UserService.getUserByUsernameOrEmail({
        username,
        email,
      });
      if (user) {
        throw new Error(Errors.UserAlreadyExist);
      }

      user = await UserService.registerUser({
        username,
        email,
        password,
      });
      if (!user) {
        throw new Error(Errors.FailedToRegister);
      }

      const cashFlow = await CashFlowService.addCashFlow();
      if (!cashFlow) {
        throw new Error(Errors.FailedToCreateCashFlow);
      }

      const wallet = await WalletService.addWallet({
        name: constants.DummyNameWallet,
        userID: user.dataValues.id,
        cashFlowID: cashFlow.dataValues.id,
      });
      if (!wallet) {
        throw new Error(Errors.FailedToCreateWallet);
      }

      return res.send(this.reponseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static login = async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await UserService.getUserByUsername({ username });

      if (!user) {
        throw new Error(Errors.FailedToSignIn);
      }

      const token = await UserService.loginUser({
        user,
        password,
      });

      const wallets = await WalletService.getWallets(user.dataValues.id);

      return res.send({
        message: constants.Success,
        wallet: wallets[0],
        token,
      });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };
}

export default UserController;
