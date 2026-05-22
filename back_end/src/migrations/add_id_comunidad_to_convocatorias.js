'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Verificar si la columna ya existe
        const [results] = await queryInterface.sequelize.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'convocatorias'
        AND COLUMN_NAME = 'id_comunidad'
    `);

        if (results.length > 0) {
            console.log('✓ Columna id_comunidad ya existe — nada que hacer.');
            return;
        }

        // Agregar columna
        await queryInterface.addColumn('convocatorias', 'id_comunidad', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        // Agregar foreign key
        await queryInterface.addConstraint('convocatorias', {
            fields: ['id_comunidad'],
            type: 'foreign key',
            name: 'fk_conv_comunidad',
            references: {
                table: 'comunidades',
                field: 'id_comunidad',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });

        console.log('✓ Columna id_comunidad agregada correctamente.');
    },

    async down(queryInterface, Sequelize) {
        // Eliminar constraint primero
        await queryInterface.removeConstraint('convocatorias', 'fk_conv_comunidad');

        // Luego eliminar columna
        await queryInterface.removeColumn('convocatorias', 'id_comunidad');

        console.log('↩ Migración revertida.');
    },
};