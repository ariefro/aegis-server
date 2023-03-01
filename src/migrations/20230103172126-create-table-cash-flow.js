module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cash_flows', {
      id: {
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      income: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      expense: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('cash_flows');
  },
};
