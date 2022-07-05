const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class Response extends Model {}

Response.init({
    nota: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    timestamps: false,
    modelName: "response"
});

module.exports = Response;