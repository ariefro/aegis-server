import { compareSync, hashSync } from 'bcrypt';
import { or } from 'sequelize';
import errors from '../constants/errors';
import { User } from '../models';
import Jwt from '../utils/jwt';

class UserService {
  static getUsers = () => User.findAll();

  static getUserByUsernameOrEmail = async ({ username, email }) => {
    const user = await User.findOne({
      where: or({ username }, { email }),
    });

    return user;
  };

  static getUserById = async ({ id }) => {
    const user = await User.findOne({
      where: { id },
    });
    return user;
  };

  static getUserByUsername = async ({ username }) => {
    const user = await User.findOne({
      where: { username },
    });

    return user;
  };

  static registerUser = async ({ username, email, password }) => User.create({
    username,
    email,
    password: hashSync(password, 10),
  });

  static loginUser = async ({ user, password }) => {
    if (!user || !compareSync(password, user.password)) {
      throw new Error(errors.FailedToSignIn);
    }

    const token = await this.generateAccessToken(user);

    return token;
  };

  static tokenCheck = async (user, refreshToken) => {
    const verify = Jwt.verifyRefreshToken(refreshToken);

    if (
      !refreshToken
      || !verify.username
      || verify.token_version !== user.token_version
    ) {
      const newToken = await this.generateRefreshToken(user);

      await this.updateToken(user.username, newToken);

      return newToken;
    }

    return refreshToken;
  };

  static tokenVersionChecker = async (user, tokenVersion) => {
    if (tokenVersion !== user.token_version) {
      throw new Error(errors.TokenVersionNotValid);
    }

    const token = await this.generateAccessToken(user);

    return token;
  };

  static generateAccessToken = async (user) => {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const token = Jwt.sign(payload);

    return token;
  };

  static generateRefreshToken = async (user) => {
    const payload = {
      username: user.username,
      email: user.email,
      token_version: user.token_version,
    };

    const token = Jwt.signRefreshToken(payload);

    return token;
  };

  static updateToken = async (username, refresh_token) => {
    await User.update(
      { refresh_token },
      {
        where: {
          username,
        },
      },
    );
  };

  static updateTokenVersion = async (username, token_version) => {
    await User.update(
      { token_version },
      {
        where: {
          username,
        },
      },
    );
  };
}

export default UserService;
