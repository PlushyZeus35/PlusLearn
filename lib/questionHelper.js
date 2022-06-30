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
        const newQuestion = await databaseHelper.setNewQuestion(name, correct, incorrect1, incorrect2, incorrect3, quizId);
        console.log("a");
        //console.log(newQuestion.id);
        await databaseHelper.setNewAnswer(correct, true, newQuestion.id);
        await databaseHelper.setNewAnswer(incorrect1, false, newQuestion.id);
        await databaseHelper.setNewAnswer(incorrect2, false, newQuestion.id);
        await databaseHelper.setNewAnswer(incorrect3, false, newQuestion.id);
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
        let questions = [];
        const quizQuestions = await databaseHelper.getQuestionsByQuiz(quizId);

        return quizQuestions;
    }catch(e){
        console.log(e);
        req.flash('message', 'Algo ha ido mal');
        return null
    }
}

questionHelper.deleteQuestion = async (id) => {
    await databaseHelper.deleteAnswerByQuestionId(id);
    return await databaseHelper.deleteQuestionById(id);
}

questionHelper.editQuestion = async (id, name, correct, incorrect1, incorrect2, incorrect3) => {
    try{
        await databaseHelper.editQuestion(id, name, correct, incorrect1, incorrect2, incorrect3);
        const answers = await databaseHelper.getAnswerByQuestionId(id);
        let contador = 0;
        answers.forEach(function(element){
            if(element.isCorrect){
                databaseHelper.editAnswer(element.id, correct);
            }else{
                contador++;
                if(contador == 1){
                    databaseHelper.editAnswer(element.id, incorrect1);
                }
                if(contador == 2){
                    databaseHelper.editAnswer(element.id, incorrect2);
                }
                if(contador == 3){
                    databaseHelper.editAnswer(element.id, incorrect3);
                }
            }
        })
    }catch(e){
        console.log(e);
    }
}

questionHelper.getQuizIdFromQuestionId = async (questionId) => {
    try{
        let question = await databaseHelper.getQuestionById(questionId);
        return question[0].quizId;
    }catch(e){
        console.log(e);
    }
}

module.exports = questionHelper;