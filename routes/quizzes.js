var express = require('express');
const answerHelper = require('../lib/answerHelper');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const questionHelper = require('../lib/questionHelper');
const quizHelper = require('../lib/quizHelper');
const responseHelper = require('../lib/responseHelper');
//const databaseHelper = require('../lib/databaseHelper');

router.get('/edit', isLoggedIn, async (req, res) => {
    let quizId = req.query.quizId;
    const quiz = await quizHelper.getQuiz(quizId);
    //console.log(quiz.userId);
    if(quiz.userId == req.user.id){

        const quizQuestions = await questionHelper.getQuestions(quizId);
        const quizResponses = await responseHelper.getQuizResponses(quizId);
        console.log("devuelto:")
        console.log(quizResponses);
        console.log(quiz);
        if(quiz != null){
            res.render('editquiz', {quiz, quizQuestions, quizResponses});
        }else{
            req.flash('message', 'Algo ha ido mal!');
            res.redirect('/profile');
        }

    }else{
        req.flash('message', 'Algo ha ido mal!');
        res.redirect('/profile');
    }
    
    
})

router.post('/add', isLoggedIn, async (req, res) => {
    let quizName = req.body.quizName;
    let quizDesc = req.body.quizDesc;
    console.log(quizName);
    if(await quizHelper.isQuizRepeated(quizName)){
        req.flash('message', 'That Quiz already exists!');
    }else{
        await quizHelper.setNewQuiz(req, quizName, quizDesc);
        req.flash('success', 'Quiz creado');
    }
    res.redirect('/profile');
})

router.get('/delete', isLoggedIn, async (req, res) => {
    let quizId = req.query.quizId;
    console.log(quizId);
    const quiz = await quizHelper.getQuiz(quizId);
    if(quiz.userId == req.user.id){
        if(await quizHelper.deleteQuiz(quizId)){
            req.flash('success', 'Quiz borrado');
        }else{
            req.flash('message', 'Algo ha ido mal!');
        }
        res.redirect('/profile');
    }else{
        req.flash('message', 'Algo ha ido mal!');
        res.redirect('/profile');
    }
    
})

router.get('/play', async (req, res) => {
    let quizId = req.query.quizId;
    const quiz = await quizHelper.getQuiz(quizId);
    const quizQuestions = await questionHelper.getQuestions(quizId);
    quizQuestions.forEach(function(element){
        answerHelper.randomizeAnswers(element.answers);
    })
    console.log(quizQuestions[0].answers);
    res.render('play', {quiz, quizQuestions});
})

router.post('/played', async (req, res) => {
    let answers = req.body.results;
    const quizId = req.body.quizId;
    console.log("resultados!");
    answers = answers.split("#");
    const results = await quizHelper.checkAnswers(quizId, answers, req.user.id);
    console.log("Final:");
    console.log(results);
    res.render('results', {results});
})


module.exports = router;