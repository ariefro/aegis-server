module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.DataTypes.STRING,
    });
    await queryInterface.addColumn('users', 'token_version', {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'refresh_token');
    await queryInterface.removeColumn('users', 'token_version');
  },
};
