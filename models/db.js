const Sequelize = require('sequelize');
const UserModel = require('./users.js');
const UserTypeModel = require('./userTypes.js');
const { database } = require('./keys');

const sequelize = new Sequelize(database.database, database.user, database.password,{
    host: database.host,
    dialect: 'mysql'
});

// Tables creation
const User = UserModel(sequelize, Sequelize);
const UserType = UserTypeModel(sequelize, Sequelize);

// Tables relations
UserType.hasMany(User, { as: "users" });


sequelize.sync({force: false})
    .then(() => {
        console.log('Tablas sincronizadas');
    })

module.exports = {
    User,
    UserType
}