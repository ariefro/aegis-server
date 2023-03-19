import { body, param, validationResult } from 'express-validator';
import Services from '../constants/services';
import Errors from '../constants/errors';
import {
  Amount,
  Currency, Email, ID, Name, Password, Transfer, Type, TypeTransaction, Username, WalletID,
} from '../constants';

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
        param(ID, Errors.WalletNotFound).notEmpty().isUUID(),
        body(Name, Errors.NameEmpty).notEmpty(),
        body(Currency, Errors.InvalidCurrency).isIn(['IDR']),
      ];
    }

    case Services.DeleteWallet: {
      return [param(ID, Errors.WalletEmpty).notEmpty().isUUID()];
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
          } else if (value === Transfer && !req.body.to_wallet_id) {
            throw new Error(Errors.DestinationTransferEmpty);
          } else if (value === Transfer && req.body.wallet_id === req.body.to_wallet_id) {
            throw new Error(Errors.UnableToCreateTransferTransaction);
          }

          return true;
        }),
        body(WalletID, Errors.WalletEmpty).notEmpty().isUUID(),
        body(Name, Errors.NameTransactionEmpty).notEmpty(),
        body(Name, Errors.NameTransactionOnlyLetters).isString(),
        body(Currency, Errors.InvalidCurrency).isIn(['IDR']),
        body(Amount, Errors.AmountEmpty).notEmpty(),
        body(Type, Errors.TypeOfTransactionShouldBeEmpty).isEmpty(),
        body(Amount, Errors.AmountOnlyNumbers).isInt({ min: 0 }),
      ];
    }

    case Services.UpdateTransaction: {
      return [
        param(ID, Errors.TransactionNotFound).notEmpty().isUUID(),
        body(TypeTransaction, Errors.InvalidTypeTransaction).isIn([
          'payout',
          'top up',
          'transfer',
          'payment',
        ]).custom((value, { req }) => {
          if (value !== Transfer && req.body.to_wallet_id) {
            throw new Error(Errors.DestinationTransferShouldBeEmpty);
          } else if (value === Transfer && !req.body.to_wallet_id) {
            throw new Error(Errors.DestinationTransferEmpty);
          } else if (value === Transfer && req.body.wallet_id === req.body.to_wallet_id) {
            throw new Error(Errors.UnableToCreateTransferTransaction);
          }

          return true;
        }),
        body(WalletID, Errors.WalletEmpty).notEmpty().isUUID(),
        body(Name, Errors.NameTransactionEmpty).notEmpty(),
        body(Name, Errors.NameTransactionOnlyLetters).isString(),
        body(Currency, Errors.InvalidCurrency).isIn(['IDR']),
        body(Type, Errors.TypeOfTransactionShouldBeEmpty).isEmpty(),
        body(Amount, Errors.AmountEmpty).notEmpty(),
        body(Amount, Errors.AmountOnlyNumbers).isInt({ min: 0 }),
      ];
    }

    case Services.DeleteTransaction: {
      return [param(ID, Errors.TransactionNotFound).notEmpty().isUUID()];
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
