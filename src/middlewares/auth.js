import errors from '../constants/errors';
import UserService from '../services/user-service';
import Jwt from '../utils/jwt';

const AuthMiddleware = async (req, res, next) => {
  try {
    const {
      headers: { authorization = undefined },
    } = req;

    const unauthorized = () => res.status(401).json({ message: errors.Unauthorized });

    if (!authorization) return unauthorized();

    const token = authorization.split(' ')[1];
    const payload = Jwt.verifyAccessToken(token);

    if (payload.message) {
      throw new Error(payload.message);
    }

    const user = await UserService.getUserById({
      id: payload.id,
    });

    if (!user || user.email !== payload.email) return unauthorized();

    req.decoded = payload;
    return next();
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
};

export default AuthMiddleware;
