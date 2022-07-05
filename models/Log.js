const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class Log extends Model {}

Log.init({
    isError: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    errorType: {
        type: DataTypes.STRING
    },
    errCode: {
        type: DataTypes.STRING
    },
    userId: {
        type: DataTypes.INTEGER
    },
    quizId: {
        type: DataTypes.INTEGER
    }
}, {
    sequelize,
    modelName: "log"
});

module.exports = Log;