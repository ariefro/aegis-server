module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE SET NULL ON UPDATE CASCADE;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_to_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_to_wallet_id_fkey FOREIGN KEY (to_wallet_id) REFERENCES public.wallets(id) ON DELETE SET NULL ON UPDATE CASCADE;');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions DROP CONSTRAINT transactions_to_wallet_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.transactions ADD CONSTRAINT transactions_to_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);');
  },
};
