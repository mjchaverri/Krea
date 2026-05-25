const { Sequelize } = require('sequelize');

const config = require('./config');
const sequelize = new Sequelize(
    config.development.database,
    config.development.username,
    config.development.password,
    {
        host:    config.development.host,
        dialect: config.development.dialect,
        pool: {
            max:     10,
            min:     2,
            acquire: 30000,
            idle:    10000,
        },
        dialectOptions: {
            connectTimeout: 60000,
        },
        logging: false,
    }
);

module.exports = sequelize;
