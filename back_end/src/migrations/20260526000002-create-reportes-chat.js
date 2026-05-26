'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reportes_chat', {
      id_reporte_chat: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_mensaje: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'chat_comu', key: 'id_chat_comu' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_comunidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comunidades', key: 'id_comunidad' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_reportador: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      razon: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      texto_mensaje: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      autor_mensaje: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'revisado', 'descartado'),
        defaultValue: 'pendiente',
        allowNull: false,
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
    await queryInterface.dropTable('reportes_chat');
  }
};
