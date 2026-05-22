'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_miembros', {
      id_chat_miembro: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_chat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'chat_comu', key: 'id_chat_comu' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_miembro: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'miembros', key: 'id_miembro' },
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
    await queryInterface.dropTable('chat_miembros');
  }
};
