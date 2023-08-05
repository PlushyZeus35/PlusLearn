const responseSelector = {};
const TestResponse = require('../models/testresponse');
const Response = require('../models/response');
const emailController = require('./emailController');
const { Op, where } = require("sequelize");

responseSelector.createBulkTestResponses = async (responses) => {
    let testResponses = [];
    try{
        testResponses = await TestResponse.bulkCreate(responses);
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return testResponses;
}

responseSelector.createBulkResponses = async (responses) => {
    let newResponses = [];
    try{
        newResponses = await Response.bulkCreate(responses);
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return newResponses;
}

responseSelector.getTestResponses = async (testId) => {
    let testResponses = [];
    try{
        testResponses = await TestResponse.findAll(
            {where: {
                testId: testId
            }}
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return testResponses;
}

responseSelector.getUserResponses = async (testResponses) => {
    let responses = [];
    try{
        responses = await Response.findAll(
            {where: {
                testresponseId: testResponses
            }}
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return responses;
}

responseSelector.deleteUserResponses = async (questionIds) => {
    let responses = [];
    try{
        responses = await Response.destroy(
            {where: {
                questionId: questionIds
            }}
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return responses;
}

responseSelector.deleteTestResponses = async (testIds) => {
    let testResponses = [];
    try{
        testResponses = await TestResponse.destroy(
            {where: {
                testId: testIds
            }}
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return testResponses;
}

responseSelector.getUserResponseCounter = async (userId) => {
    let testResponses = 0;
    try{
        testResponses = await TestResponse.count(
            {where: {
                userId: userId
            }}
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return testResponses;
}

module.exports = responseSelector;