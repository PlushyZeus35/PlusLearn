const { Sequelize } = require('sequelize');
const {database} = require('../config');

const sequelize = new Sequelize(
    database.database,
    database.user,
    database.password,
    {
        host: database.host,
        dialect: "mariadb",
        pool: {
            max: 15,
            min: 5,
            idle: 20000,
            evict: 15000,
            acquire: 30000
        },
    }
);

module.exports = sequelize;