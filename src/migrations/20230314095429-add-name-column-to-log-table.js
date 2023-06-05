module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('logs', 'name', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('logs', 'name');
  },
};
