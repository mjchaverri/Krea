'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'descripcion', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'img_perfil'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'descripcion');
  }
};
