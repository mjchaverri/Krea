'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('resenas_perfil', {
            id_resena_perfil: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id_usuario_receptor: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'usuarios', key: 'id_usuario' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            id_usuario_autor: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'usuarios', key: 'id_usuario' },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            calificacion: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            comentarios: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('resenas_perfil');
    },
};
