const { Expense, Payment } = require('../constants');

function slugToType(slug) {
  let type;
  if (slug === Payment) {
    type = Expense;
  } else {
    type = slug;
  }

  return type;
}

export default slugToType;
