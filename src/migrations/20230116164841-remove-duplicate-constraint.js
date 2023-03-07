module.exports = {
  up: async (queryInterface) => {
    await queryInterface.removeConstraint('transactions', 'transactions_wallet_id_fkey1');
    await queryInterface.removeConstraint('transactions', 'transactions_to_wallet_id_fkey1');
    await queryInterface.removeConstraint('wallets', 'wallets_cash_flow_id_fkey1');
    await queryInterface.removeConstraint('wallets', 'wallets_user_id_fkey1');
  },

  down: async (queryInterface) => {
    await queryInterface.addConstraint('transactions', 'transactions_to_wallet_id_fkey1');
    await queryInterface.addConstraint('transactions', 'transactions_wallet_id_fkey1');
    await queryInterface.addConstraint('wallets', 'wallets_cash_flow_id_fkey1');
    await queryInterface.addConstraint('wallets', 'wallets_user_id_fkey1');
  },
};
