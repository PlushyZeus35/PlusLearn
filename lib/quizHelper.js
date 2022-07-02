const { use } = require('passport');
const { database } = require('../config');
const databaseHelper = require('../lib/databaseHelper');
const questionHelper = require('../lib/questionHelper');
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

quizHelper.checkAnswers = async (quizId, responses, userId) => {
    var results = {
        nota: 0,
        questions: []
    }
    console.log("EVALUANDO RESULTADOS");
    console.log(quizId);
    console.log(responses);
    const questions = await questionHelper.getQuestions(quizId);
    questions.forEach(function(element, index, array){
        const question = {
            id: element.id,
            name: element.name,
            answers: []
        }
        element.answers.forEach(function(eachanswer, index, array){
            const answer = {
                id: eachanswer.id,
                name: eachanswer.name,
                isCorrect: eachanswer.isCorrect,
                isChosen: false
            }
            responses.forEach(function(element){
                console.log(element);
                console.log(eachanswer.id)
                if(element == eachanswer.id){
                    answer.isChosen = true;
                }
            })
            question.answers.push(answer);
        })
        results.questions.push(question);
    });
    let nota = calcNota(results.questions);
    console.log(userId);
    await setNewResponse(quizId, userId, nota);
    results.nota = nota;
    console.log(results);
    return results;
}

async function setNewResponse(idQuiz, idUser, nota) {
    console.log("A poner en la base datos");
    console.log(idQuiz)
    console.log(idUser)
    console.log(nota)
    await databaseHelper.setNewResponse(idQuiz,idUser,nota);
} 

function calcNota (results) {
    let totalQuestions = 0;
    let totalCorrectas = 0;
    let totalIncorrectas = 0;
    results.forEach(function(eachQuestion){
        totalQuestions++;
        eachQuestion.answers.forEach(function(eachAnswer){
            if(eachAnswer.isCorrect && eachAnswer.isChosen){
                totalCorrectas++;
            }
        })
    });
    totalIncorrectas = totalQuestions - totalCorrectas;
    let nota = totalCorrectas * 10;
    nota = nota / totalQuestions;
    console.log('CORRECTAS: %d', totalCorrectas);
    console.log('INCORRECTAS: %d', totalIncorrectas);
    console.log('NOTA: ', nota);
    return nota;
}

module.exports = quizHelper;