'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('chat_comu', 'id_usuario', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'usuarios', key: 'id_usuario' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('chat_comu', 'id_usuario');
  }
};
