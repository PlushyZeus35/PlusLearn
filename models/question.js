const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');

class Question extends Model {}

Question.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "question"
});

module.exports = Question;