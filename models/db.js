const { Sequelize } = require('sequelize');
const {database} = require('../config');

const sequelize = new Sequelize(
    database.database,
    database.user,
    database.password,
    {
        host: database.host,
        dialect: "mysql"
    }
);

module.exports = sequelize;