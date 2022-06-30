const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class Answer extends Model {}

Answer.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "answer"
});

module.exports = Answer;