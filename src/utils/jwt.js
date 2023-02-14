/* eslint-disable no-lone-blocks */
/* eslint-disable implicit-arrow-linebreak */
import jwt from 'jsonwebtoken';
import Errors from '../constants/errors';

class Jwt {
  static OPTIONS = {
    expiresIn: '1h',
    algorithm: 'HS256',
  };

  static REFRESH_OPTIONS = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };

  static sign = (payload) => {
    if (!process.env.SECRET) {
      throw new Error(Errors.MissingSecretKey);
    }

    return jwt.sign(payload, process.env.SECRET, this.OPTIONS);
  };

  static signRefreshToken = (payload) => {
    if (!process.env.REFRESH_SECRET) {
      throw new Error(Errors.MissingSecretKey);
    }

    return jwt.sign(payload, process.env.REFRESH_SECRET, this.REFRESH_OPTIONS);
  };

  static verify = (token) =>
    jwt.verify(token, process.env.SECRET, this.OPTIONS);

  static verifyRefreshToken = (token) =>
    jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return err;
      }
      return decoded;
    });

  static decodeToken = (token) => jwt.decode(token);
}

export default Jwt;
