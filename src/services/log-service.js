import { Log } from '../models';

class LogService {
  static createLog = async (
    userID,
    name,
    slug,
    type,
    message,
  ) => Log.create({
    user_id: userID,
    name,
    slug,
    type,
    message,
  });

  static getLogs = async (id) => Log.findAll({
    where: {
      user_id: id,
    },
    order: [['created_at', 'DESC']],
    attributes: { exclude: ['id', 'user_id', 'slug'] },
  });
}

export default LogService;
