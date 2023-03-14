module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logs', {
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
      slug: {
        allowNull: false,
        type: Sequelize.ENUM('payout', 'top-up', 'transfer', 'payment'),
      },
      type: {
        type: Sequelize.ENUM('expense', 'income', 'transfer'),
        allowNull: false,
      },
      message: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('logs');
  },
};
