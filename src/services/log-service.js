import { Log } from '../models';

class LogService {
  static createLog = async (
    userID,
    slug,
    type,
    message,
  ) => Log.create({
    user_id: userID,
    slug,
    type,
    message,
  });

  static getLogs = async (id) => Log.findAll({
    where: {
      user_id: id,
    },
    attributes: { exclude: ['id', 'user_id'] },
  });
}

export default LogService;
