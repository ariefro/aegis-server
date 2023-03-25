import { sequelize } from '../models';
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
      await sequelize.transaction(async (transaction) => {
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
          transaction,
        });
        if (!user) {
          throw new Error(Errors.FailedToRegister);
        }

        const refreshToken = await UserService.generateRefreshToken(user);

        await UserService.updateToken({ username, refreshToken, transaction });

        const cashFlow = await CashFlowService.addCashFlow({ transaction });
        if (!cashFlow) {
          throw new Error(Errors.FailedToCreateCashFlow);
        }

        const wallet = await WalletService.addWallet({
          name: constants.DummyNameWallet,
          userID: user.dataValues.id,
          cashFlowID: cashFlow.dataValues.id,
          transaction,
        });
        if (!wallet) {
          throw new Error(Errors.FailedToCreateWallet);
        }
      });

      return res.send(this.responseSuccess());
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

      const accessToken = await UserService.loginUser({
        user,
        password,
      });

      let { refresh_token: refreshToken } = user.dataValues;

      refreshToken = await UserService.tokenCheck(user, refreshToken);

      const wallets = await WalletService.getWallets(user.dataValues.id);

      return res
        .cookie('refresh_token', refreshToken, {
          maxAges: 1000 * 60 * 60 * 24,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .send({
          message: constants.Success,
          wallet: wallets[0],
          access_token: accessToken,
        });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };

  static refreshToken = async (req, res) => {
    try {
      const { username, token_version: tokenVersion } = req.payload;

      const user = await UserService.getUserByUsername({ username });

      const accessToken = await UserService.tokenVersionChecker(
        user,
        tokenVersion,
      );

      return res.send({
        access_token: accessToken,
      });
    } catch (error) {
      return res.send({ message: error.message });
    }
  };

  static logout = async (req, res) => {
    try {
      const { username, token_version } = req.payload;

      const newVersion = token_version + 1;

      await UserService.updateTokenVersion(username, newVersion);

      res
        .cookie('refresh_token', '', {
          maxAge: 0,
          overwrite: true,
        })
        .clearCookie('refresh_token')
        .send({
          message: 'success',
        });
    } catch (error) {
      res.send(error.message);
    }
  };
}

export default UserController;
