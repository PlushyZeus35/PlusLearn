const testSelector = {};
const Test = require('../models/test')
const { Op } = require("sequelize");

testSelector.createTest = async (title, userId) => {
    return await Test.create(
        { 
            title: title,
            userId: userId 
        }
    );
}

testSelector.getUserTests = async (userId) => {
    return await Test.findAll(
        {
            where:{
                userId: userId
            }
        }
    )
}

module.exports = testSelector;