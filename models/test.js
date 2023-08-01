const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');

class Test extends Model {}

Test.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT('long')
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    interactive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    interactiveCode: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: "test"
});

module.exports = Test;