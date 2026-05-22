'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comunidades', {
      id_comunidad: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING(40),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING(60),
        allowNull: false
      },
      icono: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Color: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      ColorClaro: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      banner: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      id_categoria: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'categorias', key: 'id_categoria' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('comunidades');
  }
};
