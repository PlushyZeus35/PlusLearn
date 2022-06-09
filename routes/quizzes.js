var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const quizHelper = require('../lib/quizHelper');
//const databaseHelper = require('../lib/databaseHelper');

router.get('/edit', isLoggedIn, async (req, res) => {
    let quizId = req.query.quizId;
    const quiz = await quizHelper.getQuiz(quizId);
    console.log(quiz);
    if(quiz != null){
        res.render('editquiz', {quiz});
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
    if(await quizHelper.deleteQuiz(quizId)){
        req.flash('success', 'Quiz borrado');
    }else{
        req.flash('message', 'Algo ha ido mal!');
    }
    res.redirect('/profile');
})


module.exports = router;