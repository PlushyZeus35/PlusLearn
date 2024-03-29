const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');

class Question extends Model {}

Question.init({
    title: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: "question"
});

module.exports = Question;