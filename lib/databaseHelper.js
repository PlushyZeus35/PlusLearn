const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

const databaseHelper = {};
const { Op } = require("sequelize");
const { database } = require('../config');

// User Queries
databaseHelper.getAllUser = async () => {
    return User.findAll();
}

databaseHelper.getUserByUsername = async (username) => {
    return await User.findAll({
        where: {
            username: username
        }
    });
}

databaseHelper.setNewUser = async (username, email, password, userType_id) => {
    return await User.create({ 
                            username: username, 
                            email: email, 
                            password: password, 
                            role: userType_id 
                        });
}

databaseHelper.getAllQuizzes = async () => {
    return await Quiz.findAll();
}

databaseHelper.getQuizById = async (id) => {
    const result = await Quiz.findByPk(id);
    console.log(result);
    return result;
}

databaseHelper.getQuizByName = async (name) => {
    return await Quiz.findAll({
        where: {
            name: name
        }
    })
}

databaseHelper.getQuizzesFromUser = async (userId) => {
    return await Quiz.findAll({
        where: {
            userId: userId
        }
    })
}

databaseHelper.getOtherUserQuizzes = async (userId) => {
    return await Quiz.findAll({
        where: {
            userId: {
                [Op.not]: userId
            }
        }
    })
}

databaseHelper.setNewQuiz = async (name, description, user_id) => {
    return await Quiz.create({ 
                            name: name,
                            description: description,
                            userId: user_id
                        });
}

databaseHelper.deleteQuizById = async (id) => {
    try{
        await Quiz.destroy({
                        where: {
                            id: id
                        }
        })
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
    
}

databaseHelper.getQuestionByName = async (name) => {
    return await Question.findAll({
        where: {
            name: name
        }
    })
}

databaseHelper.setNewQuestion = async (name, correct, incorrect1, incorrect2, incorrect3, quiz_id) => {
    return await Question.create({ 
                            name: name,
                            response1: correct,
                            response2: incorrect1,
                            response3: incorrect2,
                            response4: incorrect3,
                            quizId: quiz_id
                        });
}

databaseHelper.getQuestions = async (quizId) => {
    return await Question.findAll({
        where: {
            quizId: quizId
        }
    })
}

databaseHelper.deleteQuestionById = async (questionId) => {
    try{
        await Question.destroy({
                        where: {
                            id: questionId
                        }
        })
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

databaseHelper.editQuestion = async (questionId, questionName, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3) => {
    await Question.update({ 
        name: questionName,
        response1: correctAnswer,
        response2: incorrectAnswer1,
        response3: incorrectAnswer2,
        response4: incorrectAnswer3

    }, {
        where: {
          id: questionId
        }
    });
}

module.exports = databaseHelper;