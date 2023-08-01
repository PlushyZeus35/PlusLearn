const questionSelector = {};
const Question = require('../models/question')
const Answer = require('../models/answer')
const { Op, where } = require("sequelize");
const emailController = require('./emailController');

questionSelector.getAnswers = async (answersIds) => {
    let answers = [];
    try{
        answers = await Answer.findAll({
            where: {
                id: answersIds
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return answers;
}

questionSelector.getQuestions = async (questionsIds) => {
    let questions = [];
    try{
        questions = await Question.findAll({
            where:{
                id: questionsIds
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return questions;
}

questionSelector.getTestQuestions = async (testId) => {
    let questions = [];
    try{
        questions = await Question.findAll(
            {where:{
                testId: testId
            },
            order:[['order', 'DESC']]}
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return questions;
}

questionSelector.setQuestion = async (testId, order, questionName) => {
    let questions = [];
    try{
        questions = await Question.create({
            order: order,
            testId: testId,
            title: questionName
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return questions
}

questionSelector.getQuestionsAnswers = async(questionId) => {
    let answers = [];
    try{
        answers = await Answer.findAll({
            where:{
                questionId: questionId
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return answers;
}

questionSelector.deleteQuestionsAnswers = async(questionIds) => {
    let answers = [];
    try{
        answers = await Answer.destroy({
            where: {
                questionId: questionIds
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return answers;
}

questionSelector.deleteQuestions = async(questionIds) => {
    let questions = [];
    try{
        questions = await Question.destroy({
            where: {
                id: questionIds
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return questions;
}

questionSelector.updateQuestions = async(id, title, order) => {
    let questions = [];
    try{
        questions = await Question.update(
            {
                title: title,
                order: order
            },{
                where: {
                    id: id
                }
            }
        )
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    
    return questions;
}

questionSelector.createBulkAnswers = async(answers) => {
    let newAnswers = [];
    try{
        newAnswers = await Answer.bulkCreate(answers);
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return newAnswers;
}

questionSelector.getCorrectAnswers = async(questionIds) => {
    let answers = [];
    try{
        answers = await Answer.findAll({
            where:{
                questionId: questionIds,
                isCorrect: true
            }
        })
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return answers;
}

questionSelector.bulkUpdateAnswers = async(answers) => {
    let newAnswers = [];
    try{
        newAnswers = await Answer.bulkCreate(answers,{updateOnDuplicate: ["title"]});
    }catch(error){
        emailController.sendErrorEmail(error);
    }
    return newAnswers;
}

module.exports = questionSelector;