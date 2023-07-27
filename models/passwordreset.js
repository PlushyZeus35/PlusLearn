const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');
class PasswordReset extends Model {}

PasswordReset.init({
    code: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: "passwordreset"
});

module.exports = PasswordReset;