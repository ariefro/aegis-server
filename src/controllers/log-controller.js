import LogService from '../services/log-service';
import BaseController from './base-controller';

class LogController extends BaseController {
  static getLogs = async (req, res) => {
    try {
      const user = req.decoded.id;

      const logs = await LogService.getLogs(user);

      return res.send({ notifications: logs });
    } catch (err) {
      const error = this.getError(err);

      return res.status(error.code).send({ message: error.message });
    }
  };
}

export default LogController;
