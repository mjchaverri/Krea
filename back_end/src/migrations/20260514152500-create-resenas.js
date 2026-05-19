'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('resenas', {
      id_resena: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      comentarios: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      calificacion: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id_usuario' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_portafolio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'portafolios', key: 'id_portafolio' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('resenas');
  }
};
