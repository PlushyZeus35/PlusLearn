const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');

class Test extends Model {}

Test.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "test"
});

module.exports = Test;