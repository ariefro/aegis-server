import errors from '../constants/errors';
import Jwt from '../utils/jwt';

const AuthMiddleware = (req, res, next) => {
  const { headers: { authorization = undefined } } = req;

  const unauthorized = () => res.status(401).json({ message: errors.Unauthorized });

  if (!authorization) return unauthorized();

  try {
    const token = authorization.split(' ')[1];
    req.decoded = Jwt.verify(token);

    return next();
  } catch (err) {
    return unauthorized();
  }
};

export default AuthMiddleware;
