module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wallets', {
      id: {
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          key: 'id',
          model: {
            tableName: 'users',
          },
        },
      },
      currency: {
        allowNull: false,
        type: Sequelize.ENUM('IDR'),
        defaultValue: 'IDR',
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      balance: {
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
    await queryInterface.dropTable('wallets');
  },
};
