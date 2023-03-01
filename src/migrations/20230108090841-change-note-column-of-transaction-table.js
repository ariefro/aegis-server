module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('transactions', 'note', 'name', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('transactions', 'name', 'note', {
      type: Sequelize.STRING,
    });
  },
};
