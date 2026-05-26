'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('reportes_chat', 'id_usuario_autor', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'usuarios', key: 'id_usuario' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('reportes_chat', 'id_usuario_autor');
  }
};
