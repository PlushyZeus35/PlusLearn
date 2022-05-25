const {Model, DataTypes} = require('sequelize');
const sequelize = require('./db');

class User_Type extends Model {}

User_Type.init({
    name: DataTypes.STRING
}, {
    sequelize,
    modelName: "user_type",
    timestamps: false
});

module.exports = User_Type;