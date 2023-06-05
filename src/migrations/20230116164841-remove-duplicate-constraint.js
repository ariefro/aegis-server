module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeConstraint('transactions', 'transactions_wallet_id_fkey1');
    await queryInterface.removeConstraint('transactions', 'transactions_to_wallet_id_fkey1');
    await queryInterface.removeConstraint('wallets', 'wallets_cash_flow_id_fkey1');
    await queryInterface.removeConstraint('wallets', 'wallets_user_id_fkey1');
  },

  down: async (queryInterface) => {
    await queryInterface.addConstraint('transactions', {
      fields: ['wallet_id'],
      type: 'unique',
      name: 'transactions_wallet_id_fkey1',
    });
    await queryInterface.addConstraint('transactions', {
      fields: ['to_wallet_id'],
      type: 'unique',
      name: 'transactions_to_wallet_id_fkey1',
    });
    await queryInterface.addConstraint('wallets', {
      fields: ['cash_flow_id'],
      type: 'unique',
      name: 'wallets_cash_flow_id_fkey1',
    });
    await queryInterface.addConstraint('wallets', {
      fields: ['user_id'],
      type: 'unique',
      name: 'wallets_user_id_fkey1',
    });
  },
};
