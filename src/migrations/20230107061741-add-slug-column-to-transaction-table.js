module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('transactions', 'slug', {
      type: Sequelize.ENUM('payout', 'payment', 'transfer', 'top-up'),
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('transactions', 'slug');
  },
};
