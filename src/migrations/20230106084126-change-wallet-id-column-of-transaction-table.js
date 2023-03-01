module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transactions', 'wallet_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'wallets',
        },
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.changeColumn('transactions', 'to_wallet_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'wallets',
        },
      },
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('transactions', 'wallet_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'wallets',
        },
      },
    });
    await queryInterface.changeColumn('transactions', 'to_wallet_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'wallets',
        },
      },
    });
  },
};
