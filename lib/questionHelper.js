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

module.exports = questionHelper;