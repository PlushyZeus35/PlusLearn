const questionSelector = {};
const Question = require('../models/question')
const Answer = require('../models/answer')
const { Op } = require("sequelize");

questionSelector.getTestQuestions = async (testId) => {
    return await Question.findAll(
        {where:{
            testId: testId
        }}
    )
}

questionSelector.setQuestion = async (testId, order, questionName) => {
    return await Question.create({
        order: order,
        testId: testId,
        title: questionName
    })
}

questionSelector.getQuestionsAnswers = async(questionId) => {
    return await Answer.findAll({
        where:{
            questionId: questionId
        }
    })
}

questionSelector.deleteQuestionsAnswers = async(questionId) => {
    return await Answer.destroy({
        where: {
            questionId: questionId
        }
    })
}

module.exports = questionSelector;