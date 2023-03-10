import { body, param, validationResult } from 'express-validator';
import Services from '../constants/services';
import Errors from '../constants/errors';
import {
  Currency, Email, Id, Name, Password, Transfer, TypeTransaction, Username,
} from '../constants';
import Jwt from '../utils/jwt';

const validationRules = (service) => {
  switch (service) {
    case Services.RegisterUser: {
      return [
        body(Username, Errors.UsernameEmpty).exists().notEmpty(),
        body(Email, Errors.EmailEmpty).exists().notEmpty(),
        body(Email, Errors.InvalidEmail).isEmail(),
        body(Password, Errors.PasswordEmpty).exists(),
        body(Password, Errors.LengthPassword).isLength({ min: 8 }),
      ];
    }

    case Services.Login: {
      return [
        body(Username, Errors.UsernameEmpty).exists().notEmpty(),
        body(Password, Errors.PasswordEmpty).exists().notEmpty(),
      ];
    }

    case Services.AddWallet: {
      return [
        body(Name, Errors.NameEmpty).exists().notEmpty(),
        body(Currency, Errors.InvalidCurrency).isIn(['IDR']),
      ];
    }

    case Services.UpdateWallet: {
      return [
        body(Name, Errors.NameEmpty).notEmpty(),
        body(Currency, Errors.InvalidCurrency).isIn(['IDR']),
        param(Id, Errors.WalletNotFound).isUUID(),
      ];
    }

    case Services.DeleteWallet: {
      return [param(Id, Errors.WalletNotFound).isUUID()];
    }

    case Services.AddTransaction: {
      return [
        body(TypeTransaction, Errors.InvalidTypeTransaction).isIn([
          'payout',
          'top up',
          'transfer',
          'payment',
        ]).custom((value, { req }) => {
          if (value !== Transfer && req.body.to_wallet_id) {
            throw new Error(Errors.DestinationTransferShouldBeEmpty);
          }
          return true;
        }).custom((value, { req }) => {
          if (value === Transfer && !req.body.to_wallet_id) {
            throw new Error(Errors.DestinationTransferEmpty);
          }
          return true;
        }),
        body(Name, Errors.NameTransactionEmpty).notEmpty(),
        body(Currency, Errors.InvalidCurrency).isIn(['IDR']),
      ];
    }

    case Services.UpdateTransaction: {
      return [
        body(TypeTransaction, Errors.InvalidTypeTransaction).isIn([
          'payout',
          'top up',
          'transfer',
          'payment',
        ]),
        body(Name, Errors.NameTransactionEmpty).notEmpty(),
        body(Currency, Errors.InvalidCurrency).isIn(['IDR']),
      ];
    }

    case Services.DeleteTransaction: {
      return [param(Id, Errors.TransactionNotFound).isUUID()];
    }

    default: {
      return null;
    }
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ message: err.msg }));

  return res.status(400).send(extractedErrors[0]);
};

const validateRefreshToken = async (req, res, next) => {
  const { refresh_token: refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(403).send({
      status: 'Error',
      message: 'No token provided',
    });
  }

  const verify = await Jwt.verifyRefreshToken(refreshToken);

  if (verify.username) {
    req.decoded = verify;
    return next();
  }
  return res.status(400).send({ status: verify.name, message: verify.message });
};

module.exports = {
  validationRules,
  validate,
  validateRefreshToken,
};
