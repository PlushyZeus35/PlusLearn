const testSelector = {};
const Test = require('../models/test')
const { Op } = require("sequelize");
const emailController = require('./emailController');

testSelector.createTest = async (title, description, intCode, userId) => {
    let tests = [];
    try{
        tests = await Test.create(
            { 
                title: title,
                description: description,
                userId: userId,
                interactiveCode: intCode 
            }
        );
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return tests;
}

testSelector.getUserTests = async (userId) => {
    let tests = [];
    try{
        tests = await Test.findAll(
            {
                where:{
                    userId: userId
                },
                order:[['updatedAt', 'DESC']]
            }
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return tests;
}

testSelector.getTest = async (testId) => {
    let test = {}
    try{    
        test =  await Test.findByPk(testId);
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return test;
}

testSelector.updateTest = async (testId, title, description, active) => {
    let tests = [];
    try{
        tests =  await Test.update(
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
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    
    return tests;
}

testSelector.checkInteractiveCode = async (code) => {
    let tests = [];
    try{
        tests = await Test.findAll({
            where: {
                interactiveCode: code
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return tests;
}

testSelector.deleteTest = async (testId) => {
    let tests = [];
    try{
        tests = await Test.destroy(
            {
                where:{
                    id: testId
                }
            }
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return tests;
}

testSelector.userTestCount = async (userId) => {
    let test = 0;
    try{
        test = await Test.count({
            where: {
                userId: userId
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error)
    }
    return test;
}

testSelector.checkInteractiveCodeActiveTest = async (code) => {
    let tests = [];
    try{
        tests = await Test.findAll({
            where: {
                interactiveCode: code,
                active: true
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return tests;
}


module.exports = testSelector;