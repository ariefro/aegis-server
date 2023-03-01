module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('wallets', 'user_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'users',
        },
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.changeColumn('wallets', 'cash_flow_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'cash_flows',
        },
      },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('wallets', 'user_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'users',
        },
      },
    });
    await queryInterface.changeColumn('wallets', 'cash_flow_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'cash_flows',
        },
      },
    });
  },
};
