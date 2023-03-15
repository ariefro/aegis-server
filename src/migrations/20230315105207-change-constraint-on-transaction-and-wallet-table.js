module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE SET NULL;');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);');
  },
};
