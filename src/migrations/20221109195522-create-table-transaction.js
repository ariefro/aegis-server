module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      wallet_id: {
        type: Sequelize.UUID,
        references: {
          key: 'id',
          model: {
            tableName: 'wallets',
          },
        },
      },
      to_wallet_id: {
        type: Sequelize.UUID,
        references: {
          key: 'id',
          model: {
            tableName: 'wallets',
          },
        },
      },
      currency: {
        allowNull: false,
        type: Sequelize.ENUM('IDR'),
        defaultValue: 'IDR',
      },
      type: {
        type: Sequelize.ENUM('expense', 'income', 'transfer'),
        allowNull: false,
        defaultValue: 'expense',
      },
      note: {
        type: Sequelize.STRING,
      },
      amount: {
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
    await queryInterface.dropTable('transactions');
  },
};
