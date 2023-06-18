const testSelector = {};
const Test = require('../models/test')
const { Op } = require("sequelize");

testSelector.createTest = async (title, description, intCode, userId) => {
    return await Test.create(
        { 
            title: title,
            description: description,
            userId: userId,
            interactiveCode: intCode 
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

testSelector.getTest = async (testId) => {
    return await Test.findByPk(testId);
}

testSelector.updateTest = async (testId, title, description, active) => {
    return await Test.update(
        {
            active: active,
            title: title,
            description: description
        },{
            where: {
                id: testId
            }
        }
    )
}

testSelector.checkInteractiveCode = async (code) => {
    return await Test.findAll({
        where: {
            interactiveCode: code
        }
    })
}

module.exports = testSelector;