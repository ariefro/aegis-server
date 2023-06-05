const {
  Expense, Transfer, Income, TopUp,
} = require('../constants');

function slugToType(slug) {
  let type;
  if (slug === Transfer) {
    type = Transfer;
  } else if (slug === TopUp) {
    type = Income;
  } else {
    type = Expense;
  }

  return type;
}

export default slugToType;
