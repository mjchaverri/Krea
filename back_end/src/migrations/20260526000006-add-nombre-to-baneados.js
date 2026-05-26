'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('baneados_comunidad', 'nombre_usuario', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('baneados_comunidad', 'nombre_usuario');
  }
};
