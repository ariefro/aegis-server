module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transactions', 'slug', {
      type: Sequelize.ENUM('expense', 'income', 'transfer', 'payment'),
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('transactions', 'slug');
  },
};
