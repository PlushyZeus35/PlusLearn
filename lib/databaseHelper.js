const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Response = require('../models/Response');
const { DateTime } = require('luxon');

const databaseHelper = {};
const { Op, DataTypes } = require("sequelize");
const { database } = require('../config');

// * USER QUERIES

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

databaseHelper.getUserById = async (userId) => {
    return await User.findByPk(userId);
}

databaseHelper.setNewUser = async (username, email, password, role) => {
    return await User.create({ 
                            username: username, 
                            email: email, 
                            password: password, 
                            role: role,
                            createdAt: DateTime.now(),
                            activityAt: DateTime.now()
                        });
}

databaseHelper.updateUserActivity = async (idUser) => {
    return await User.update({
                            activityAt: DateTime.now()
                            }, {
                                where: {
                                    id: idUser
                                }
                            });
}

databaseHelper.getUsersAfterDate = async(date) => {
    return await User.findAll({
        where: {
            createdAt: {
                [Op.gt]: date
            }
        }
    })
}

databaseHelper.howManyUsers = async () => {
    return await User.count({
        where: {
          role: 1
        }
    });
}

databaseHelper.howManyAdmins = async () => {
    return await User.count({
        where: {
          role: 2
        }
    });
}

databaseHelper.incrementNumQuizzes = async (idUser) => {
    await User.increment({
        numQuizzes: 1
    }, { 
        where: { 
            id: idUser
        } 
    })
}

databaseHelper.decrementNumQuizzes = async (idUser) => {
    await User.increment({
        numQuizzes: -1
    }, { 
        where: { 
            id: idUser
        } 
    })
}

// * QUIZ QUERIES

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

// * QUESTION QUERIES

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

databaseHelper.getQuestionById = async (questionId) => {
    return await Question.findAll({
        where: {
            id: questionId
        }
    })
}

databaseHelper.getQuestionsByQuiz = async (quizId) => {
    return await Question.findAll({
        where: {
            quizId: quizId
        },
        include: Answer
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

// * ANSWER QUERIES

databaseHelper.getAnswerById = async(answerId) => {
    return await Answer.findAll({
        where: {
            id: answerId
        }
    })
}

databaseHelper.getAnswerByQuestionId = async(questionId) => {
    return await Answer.findAll({
        where: {
            questionId: questionId
        }
    })
}

databaseHelper.setNewAnswer = async(name, isCorrect, questionId) => {
    return await Answer.create({ 
        name: name,
        isCorrect: isCorrect,
        questionId: questionId
    });
}

databaseHelper.deleteAnswerByQuestionId = async(questionId) => {
    try{
        await Answer.destroy({
                        where: {
                            questionId: questionId
                        }
        })
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}

databaseHelper.editAnswer = async (answerId, name) => {
    await Answer.update({ 
        name: name,
    }, {
        where: {
          id: answerId
        }
    });
}

// * RESPONSES QUERIES
databaseHelper.setNewResponse = async(idQuiz, idUser, nota) => {
    return await Response.create({ 
        nota: nota,
        userId: idUser,
        quizId: idQuiz,
        createdAt: DateTime.now()
    });
}

databaseHelper.getQuizResponses = async(quizId) => {
    return await Response.findAll({
        where: {
            quizId: quizId
        }
    })
}

databaseHelper.getResponsesAfterDate = async(date) => {
    return await Response.findAll({
        where: {
            createdAt: {
                [Op.gt]: date
            }
        }
    })
}

databaseHelper.getCountResponsesAtDate = async(date) => {
    return await Response.count({
        where: {
            createdAt: {
                [Op.eq]: date
            }
        }
    })
}


module.exports = databaseHelper;