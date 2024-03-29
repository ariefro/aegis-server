import { validationResult } from 'express-validator';
import Errors from '../constants/errors';
import AuthMiddleware from './auth';

class Middleware {
  static Guest = (req, res, next) => this.handler('guest', req, res, next);

  static Auth = (req, res, next) => this.handler('auth', req, res, next);

  static handler = (type, req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(Errors.BadRequest);
    }

    switch (type) {
      case 'guest': return next();
      case 'auth': return AuthMiddleware(req, res, next);
      default: return res.status(403);
    }
  };
}

export default Middleware;
