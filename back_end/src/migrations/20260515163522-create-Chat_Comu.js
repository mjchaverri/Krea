'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_comu', {
      id_chat_comu: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      usuario_nombre: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      Fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      texto: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      id_comunidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comunidades', key: 'id_comunidad' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('chat_comu');
  }
};
