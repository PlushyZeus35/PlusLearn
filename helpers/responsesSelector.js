const responseSelector = {};
const TestResponse = require('../models/testresponse');
const Response = require('../models/response');
const { Op, where } = require("sequelize");

responseSelector.createBulkTestResponses = async (responses) => {
    try{
        return await TestResponse.bulkCreate(responses);
    }catch(error){
        console.log("AQUI HAY UN ERROR")
        console.log(error);
        return null;
    }
}

responseSelector.createBulkResponses = async (responses) => {
    try{
        return await Response.bulkCreate(responses);
    }catch(error){
        console.log("ERROR");
        console.log(error);
    }
}

responseSelector.getTestResponses = async (testId) => {
    return await TestResponse.findAll(
        {where: {
            testId: testId
        }}
    )
}

responseSelector.getUserResponses = async (testResponses) => {
    return await Response.findAll(
        {where: {
            testresponseId: testResponses
        }}
    )
}

module.exports = responseSelector;