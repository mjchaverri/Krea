'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'fecha_ban_expira', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.addColumn('usuarios', 'razon_ban', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'fecha_ban_expira');
    await queryInterface.removeColumn('usuarios', 'razon_ban');
  }
};
