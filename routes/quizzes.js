var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const quizHelper = require('../lib/quizHelper');
const databaseHelper = require('../lib/databaseHelper');

router.post('/quizzes', isLoggedIn, async (req, res) => {
    let quizName = req.body.quizName;
    let quizDesc = req.body.quizDesc;
    console.log(quizName);
    if(await quizHelper.isQuizRepeated(quizName)){
        req.flash('message', 'That Quiz already exists!')
        res.redirect('/profile');
    }else{
        await quizHelper.setNewQuiz(req, quizName, quizDesc);
        res.redirect('/profile');
    }
})


module.exports = router;