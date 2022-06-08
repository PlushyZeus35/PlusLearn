const { use } = require('passport');
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
        console.log(req.user.username);
        console.log(req.user.id);
        await databaseHelper.setNewQuiz(name,description, req.user.id);
        req.flash('success', 'Quiz creado!');
        return true;
    }catch(e){
        req.flash('message', 'Algo ha ido mal!');
        return false;
    }
    
}

module.exports = quizHelper;