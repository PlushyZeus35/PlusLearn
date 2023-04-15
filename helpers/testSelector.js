const testSelector = {};
const Test = require('../models/test')
const { Op } = require("sequelize");

testSelector.createTest = async (title, description, userId) => {
    return await Test.create(
        { 
            title: title,
            description: description,
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