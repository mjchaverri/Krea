'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'bloqueado', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'bloqueado');
  }
};
