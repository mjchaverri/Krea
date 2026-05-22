'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre_usuario: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      nombre_completo: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      provincia: {
        type: Sequelize.STRING(40),
        allowNull: true
      },
      canton: {
        type: Sequelize.STRING(40),
        allowNull: true
      },
      distrito: {
        type: Sequelize.STRING(40),
        allowNull: true
      },
      contrasena: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      img_perfil: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'roles', key: 'id_rol' },
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
    await queryInterface.dropTable('usuarios');
  }
};
