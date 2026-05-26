'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('baneados_comunidad', {
      id_ban: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_comunidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comunidades', key: 'id_comunidad' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      razon: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('baneados_comunidad');
  }
};
