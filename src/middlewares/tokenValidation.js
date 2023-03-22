import errors from '../constants/errors';
import UserService from '../services/user-service';
import Jwt from '../utils/jwt';

const validateAccessToken = async (req, res, next) => {
  try {
    const {
      headers: { authorization = undefined },
    } = req;

    const unauthorized = () => res.status(401).json({ message: errors.Unauthorized });

    if (!authorization) return unauthorized();

    const token = authorization.split(' ')[1];
    const data = Jwt.decodeToken(token);

    if (!data) {
      return res.send({ message: errors.NotJwtToken });
    }

    const { payload } = data;

    const user = await UserService.getUserById({
      id: payload.id,
    });

    if (
      !user
      || user.email !== payload.email
      || user.username !== payload.username
    ) {
      return unauthorized();
    }

    req.decoded = payload;
    return next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

const validateRefreshToken = async (req, res, next) => {
  try {
    const { refresh_token: refreshToken } = req.cookies;

    const unauthorized = () => res.status(401).json({ message: errors.Unauthorized });

    if (!refreshToken) {
      return res.status(403).send({
        message: errors.NoTokenProvided,
      });
    }

    const access = req.decoded;

    const payload = Jwt.verifyRefreshToken(refreshToken);

    if (payload.message) {
      throw new Error(payload.message);
    }

    if (
      access.username !== payload.username
      || access.email !== payload.email
    ) {
      return unauthorized();
    }

    const user = await UserService.getUserByUsernameOrEmail({
      username: payload.username,
      email: payload.email,
    });

    if (!user) {
      return unauthorized();
    }

    req.payload = payload;
    return next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

module.exports = {
  validateAccessToken,
  validateRefreshToken,
};
