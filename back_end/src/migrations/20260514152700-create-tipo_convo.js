'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tipos_convo', {
      id_tipo_convo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_tipo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tipos_para_convos', key: 'id_tipo_para_convo' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_convocatoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'convocatorias', key: 'id_convocatoria' },
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
    await queryInterface.dropTable('tipos_convo');
  }
};
