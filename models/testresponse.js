const {Model, DataTypes} = require('sequelize');
const sequelize = require('./index');

class TestResponse extends Model {}

TestResponse.init({
    isGuest:{
        type: DataTypes.BOOLEAN
    },
    username:{
        type: DataTypes.STRING
    },
    score:{
        type: DataTypes.FLOAT
    }
}, {
    sequelize,
    modelName: "testresponse"
});

module.exports = TestResponse;