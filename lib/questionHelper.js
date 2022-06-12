const databaseHelper = require('../lib/databaseHelper');
const questionHelper = {};


questionHelper.isQuestionRepeated = async (name) => {
    const result = await databaseHelper.getQuestionByName(name);
    if(result.length > 0){
        console.log(result);
        return true;
    }
    return false;
}

questionHelper.setNewQuestion = async (req, name, correct, incorrect1, incorrect2, incorrect3, quizId) => {
    try{
        await databaseHelper.setNewQuestion(name, correct, incorrect1, incorrect2, incorrect3, quizId);
        req.flash('success', 'Question creado!');
        return true;
    }catch(e){
        console.log(e);
        req.flash('message', 'Algo ha ido mal!');
        return false;
    }
}

questionHelper.getQuestions = async (quizId) => {
    try{
        return await databaseHelper.getQuestions(quizId);
    }catch(e){
        console.log(e);
        req.flash('message', 'Algo ha ido mal');
        return null
    }
}

questionHelper.deleteQuestion = async (id) => {
    return await databaseHelper.deleteQuestionById(id);
}

questionHelper.editQuestion = async (id, name, correct, incorrect1, incorrect2, incorrect3) => {
    try{
        await databaseHelper.editQuestion(id, name, correct, incorrect1, incorrect2, incorrect3);
    }catch(e){
        console.log(e);
    }
}

module.exports = questionHelper;