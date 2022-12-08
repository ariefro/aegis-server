import cookie from 'cookie';
import constants from '../constants';
import Errors from '../constants/errors';
import UserService from '../services/user-service';
import WalletService from '../services/wallet-service';
import BaseController from './base-controller';

class UserController extends BaseController {
  static getUsers = async (req, res) => {
    try {
      const users = await UserService.getUsers();

      return res.send(this.reponseSuccess(users));
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send(error);
    }
  };

  static registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      const getUser = await UserService.getUserByUsernameOrEmail({
        username,
        email,
      });

      if (getUser) {
        throw new Error(Errors.UserAlreadyExist);
      }

      const user = await UserService.registerUser({
        username,
        email,
        password,
      });

      await WalletService.addWallet({
        name: 'Cash',
        userId: user.dataValues.id,
      });

      return res.send(this.reponseSuccess(user));
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send(error);
    }
  };

  static login = async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await UserService.getUserByUsername({ username });

      const token = await UserService.loginUser({
        user,
        password,
      });

      const wallet = await WalletService.getWallets(user.dataValues.id);

      const serialized = cookie.serialize(constants.Token, token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        secure: true,
        sameSite: 'none',
      });

      res.setHeader(constants.SetCookie, serialized);

      return res.send(this.reponseSuccess(wallet[0]));
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send(error);
    }
  };

  static logout = async (req, res) => {
    try {
      const setCookie = cookie.serialize(constants.Token, null);

      res.setHeader(constants.SetCookie, setCookie, {
        httpOnly: true,
        maxAge: -1,
      });

      return res.send(this.reponseSuccess());
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send(error);
    }
  };
}

export default UserController;
