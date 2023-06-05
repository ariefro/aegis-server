module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('logs', 'wallet_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'wallets',
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('logs', 'to_wallet_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'wallets',
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
    await queryInterface.addColumn('logs', 'transaction_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'transactions',
        },
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('logs', 'wallet_id');
    await queryInterface.removeColumn('logs', 'transaction_id');
  },
};
