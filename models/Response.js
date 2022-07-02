const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class Response extends Model {}

Response.init({
    nota: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "response"
});

module.exports = Response;