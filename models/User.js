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
        allowNull: false
    },
    role: DataTypes.INTEGER,
    numQuizzes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    averageScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    activityAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    modelName: "user"
});

module.exports = User;