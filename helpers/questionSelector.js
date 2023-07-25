const questionSelector = {};
const Question = require('../models/question')
const Answer = require('../models/answer')
const { Op, where } = require("sequelize");

questionSelector.getAnswers = async (answersIds) => {
    return await Answer.findAll({
        where: {
            id: answersIds
        }
    })
}

questionSelector.getQuestions = async (questionsIds) => {
    return await Question.findAll({
        where:{
            id: questionsIds
        }
    })
}

questionSelector.getTestQuestions = async (testId) => {
    return await Question.findAll(
        {where:{
            testId: testId
        },
        order:[['order', 'DESC']]}
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

questionSelector.deleteQuestionsAnswers = async(questionIds) => {
    return await Answer.destroy({
        where: {
            questionId: questionIds
        }
    })
}

questionSelector.deleteQuestions = async(questionIds) => {
    return await Question.destroy({
        where: {
            id: questionIds
        }
    })
}

questionSelector.updateQuestions = async(id, title, order) => {
    return await Question.update(
        {
            title: title,
            order: order
        },{
            where: {
                id: id
            }
        }
    )
}

questionSelector.createBulkAnswers = async(answers) => {
    try{
        return await Answer.bulkCreate(answers);
    }catch(error){
        console.log("AQUI HAY UN ERROR")
        console.log(error);
        return null;
    }
    //return await Answer.bulkCreate(answers);
}

questionSelector.getCorrectAnswers = async(questionIds) => {
    return await Answer.findAll({
        where:{
            questionId: questionIds,
            isCorrect: true
        }
    })
}

module.exports = questionSelector;