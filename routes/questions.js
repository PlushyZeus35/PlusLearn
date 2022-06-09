var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const questionHelper = require('../lib/questionHelper');
//const databaseHelper = require('../lib/databaseHelper');

router.post('/add', isLoggedIn, async (req, res) => {
    let questionName = req.body.questionName;
    let correctAnswer = req.body.correctAnswer;
    let incorrectAnswer1 = req.body.incorrectAnswer1;
    let incorrectAnswer2 = req.body.incorrectAnswer2;
    let incorrectAnswer3 = req.body.incorrectAnswer3;
    let quizId = req.body.quizId;
    console.log(quizId);

    if(await questionHelper.isQuestionRepeated(questionName)){
        req.flash('message', 'That Question already exists!');
    }else{
        await questionHelper.setNewQuestion(req, questionName, correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3, quizId);
    }
    res.redirect('/profile');
    
})

module.exports = router;