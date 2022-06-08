const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class Question extends Model {}

Question.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    response1: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response2: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response3: {
        type: DataTypes.STRING,
        allowNull: false
    },
    response4: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "question"
});

module.exports = Question;