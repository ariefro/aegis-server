import { Sequelize } from 'sequelize';
import { CashFlow } from '../models';

class CashFlowService {
  static addCashFlow = async () => CashFlow.create({
    income: 0,
    expense: 0,
  });

  static updateCashFlow = async (id, income, expense) => {
    await CashFlow.update(
      {
        income,
        expense,
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      {
        where: {
          id,
        },
      },
    );
  };
}

export default CashFlowService;
