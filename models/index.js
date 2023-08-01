const { Sequelize } = require('sequelize');
const {database} = require('../config');
const emailController = require('../helpers/emailController');
let sequelize;

try{
    sequelize = new Sequelize(
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
            timezone: '+02:00'
        }
    );
}catch(error){
    emailController.sendErrorEmail(error);
}


module.exports = sequelize;