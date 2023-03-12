import { body, param, validationResult } from 'express-validator';
import Services from '../constants/services';
import Errors from '../constants/errors';
import constants from '../constants';

const validationRules = (service) => {
  switch (service) {
    case Services.RegisterUser: {
      return [
        body(constants.Username, Errors.UsernameEmpty).exists().notEmpty(),
        body(constants.Email, Errors.EmailEmpty).exists().notEmpty(),
        body(constants.Email, Errors.InvalidEmail).isEmail(),
        body(constants.Password, Errors.PasswordEmpty).exists(),
        body(constants.Password, Errors.LengthPassword).isLength({ min: 8 }),
      ];
    }

    case Services.Login: {
      return [
        body(constants.Username, Errors.UsernameEmpty).exists().notEmpty(),
        body(constants.Password, Errors.PasswordEmpty).exists().notEmpty(),
      ];
    }

    case Services.AddWallet: {
      return [
        body(constants.Name, Errors.NameEmpty).exists().notEmpty(),
        body(constants.Currency, Errors.InvalidCurrency).isIn(['IDR']),
      ];
    }

    case Services.UpdateWallet: {
      return [
        body(constants.Name, Errors.NameEmpty).notEmpty(),
        body(constants.Currency, Errors.InvalidCurrency).isIn(['IDR']),
        param(constants.Id, Errors.WalletNotFound).isUUID(),
      ];
    }

    case Services.DeleteWallet: {
      return [param(constants.Id, Errors.WalletNotFound).isUUID()];
    }

    case Services.AddTransaction: {
      return [
        body(constants.TypeTransaction, Errors.InvalidTypeTransaction).isIn([
          'payout',
          'top up',
          'transfer',
          'payment',
        ]),
        body(constants.Name, Errors.NameTransactionEmpty).notEmpty(),
        body(constants.Currency, Errors.InvalidCurrency).isIn(['IDR']),
      ];
    }

    case Services.UpdateTransaction: {
      return [
        body(constants.TypeTransaction, Errors.InvalidTypeTransaction).isIn([
          'payout',
          'top up',
          'transfer',
          'payment',
        ]),
        body(constants.Name, Errors.NameTransactionEmpty).notEmpty(),
        body(constants.Currency, Errors.InvalidCurrency).isIn(['IDR']),
      ];
    }

    case Services.DeleteTransaction: {
      return [param(constants.Id, Errors.TransactionNotFound).isUUID()];
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

module.exports = {
  validationRules,
  validate,
};
