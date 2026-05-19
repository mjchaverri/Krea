'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('miembros', {
      id_miembro: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      Fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_comunidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comunidades', key: 'id_comunidad' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
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
    await queryInterface.dropTable('miembros');
  }
};
