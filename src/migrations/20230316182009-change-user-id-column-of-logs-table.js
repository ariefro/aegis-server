module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.logs DROP CONSTRAINT logs_user_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.logs ADD CONSTRAINT logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE ON UPDATE CASCADE;');
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query('ALTER TABLE public.logs DROP CONSTRAINT logs_user_id_fkey;');
    await queryInterface.sequelize.query('ALTER TABLE public.logs ADD CONSTRAINT logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);');
  },
};
