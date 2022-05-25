const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class Quiz extends Model {}

Quiz.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Quiz name must be unique in the server'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "quiz"
});

module.exports = Quiz;