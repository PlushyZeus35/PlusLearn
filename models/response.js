const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');

class Response extends Model {}

Response.init({
    
}, {
    sequelize,
    modelName: "response"
});

module.exports = Response;