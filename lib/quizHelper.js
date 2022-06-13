const { use } = require('passport');
const { database } = require('../config');
const databaseHelper = require('../lib/databaseHelper');
const quizHelper = {};


quizHelper.isQuizRepeated = async (name) => {
    const result = await databaseHelper.getQuizByName(name);
    if(result.length > 0){
        console.log(result);
        return true;
    }
    return false;
}

quizHelper.setNewQuiz = async (req, name, description) => {
    try{
        await databaseHelper.setNewQuiz(name,description, req.user.id);
        req.flash('success', 'Quiz creado!');
        return true;
    }catch(e){
        req.flash('message', 'Algo ha ido mal!');
        return false;
    }
}

quizHelper.getQuiz = async (id) => {
    return await databaseHelper.getQuizById(id);
}

quizHelper.deleteQuiz = async (id) => {
    return await databaseHelper.deleteQuizById(id);
}

quizHelper.getQuizzesFromUser = async (userId) => {
    try{
        return await databaseHelper.getQuizzesFromUser(userId);
    }catch(e){
        console.log(e);
    }
}

quizHelper.getOtherUserQuizzes = async (userId) => {
    
    try{
        return await databaseHelper.getOtherUserQuizzes(userId);
    }catch(e){
        console.log(e);
    }
        
    
}
module.exports = quizHelper;