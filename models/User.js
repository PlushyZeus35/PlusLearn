const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class User extends Model {}

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'username must be unique in the server'
        },
        validate: {

        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    role: DataTypes.INTEGER
}, {
    sequelize,
    modelName: "user"
});

module.exports = User;