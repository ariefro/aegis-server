module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
    await queryInterface.addColumn('wallets', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
    await queryInterface.addColumn('transactions', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
    await queryInterface.addColumn('cash_flows', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
    await queryInterface.addColumn('logs', 'updated_at', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'updated_at');
    await queryInterface.removeColumn('wallets', 'updated_at');
    await queryInterface.removeColumn('transactions', 'updated_at');
    await queryInterface.removeColumn('cash_flows', 'updated_at');
    await queryInterface.removeColumn('logs', 'updated_at');
  },
};
