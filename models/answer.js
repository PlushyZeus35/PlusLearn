const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');

class Answer extends Model {}

Answer.init({
    title: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "answer",
    timestamps: false
});

module.exports = Answer;