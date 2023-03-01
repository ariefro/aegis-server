module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('wallets', 'cash_flow_id', {
      type: Sequelize.UUID,
      references: {
        key: 'id',
        model: {
          tableName: 'cash_flows',
        },
      },
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('wallets', 'status', {
      type: Sequelize.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('wallets', 'cash_flow_id');
    await queryInterface.removeColumn('wallets', 'status');
  },
};
