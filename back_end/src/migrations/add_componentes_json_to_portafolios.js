'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const [results] = await queryInterface.sequelize.query(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'portafolios'
              AND COLUMN_NAME = 'componentes_json'
        `);

        if (results.length > 0) {
            console.log('✓ Columna componentes_json ya existe — nada que hacer.');
            return;
        }

        await queryInterface.addColumn('portafolios', 'componentes_json', {
            type: Sequelize.TEXT('long'),
            allowNull: true,
            defaultValue: null,
        });

        console.log('✓ Columna componentes_json agregada a portafolios.');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('portafolios', 'componentes_json');
        console.log('↩ Migración revertida.');
    },
};
