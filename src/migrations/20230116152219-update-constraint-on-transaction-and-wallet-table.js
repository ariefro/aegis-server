module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_to_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_to_wallet_id_fkey FOREIGN KEY (to_wallet_id) REFERENCES public.wallets(id) ON DELETE SET NULL;');
    await queryInterface.sequelize.query('ALTER TABLE public.wallets DROP CONSTRAINT wallets_user_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.wallets ADD CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_to_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_to_wallet_id_fkey FOREIGN KEY (to_wallet_id) REFERENCES public.wallets(id);');
    await queryInterface.sequelize.query('ALTER TABLE public.wallets DROP CONSTRAINT wallets_user_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.wallets ADD CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);');
  },
};
