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

router.get('/delete', isLoggedIn, async (req, res) => {
    let questionId = req.query.questionId;
    console.log(questionId);
    
    if(await questionHelper.deleteQuestion(questionId)){
        req.flash('success', 'Quiz borrado');
    }else{
        req.flash('message', 'Algo ha ido mal!');
    }
    res.redirect('/profile');
    
})

router.post('/edit', isLoggedIn, async (req, res) => {
    
    let questionId = req.body.questionIdInput;
    let questionName = req.body.editedQuestionName;
    let correctResponse = req.body.editedCorrectAnswer;
    let incorrectResponse1 = req.body.editedIncorrectAnswer1;
    let incorrectResponse2 = req.body.editedIncorrectAnswer2;
    let incorrectResponse3 = req.body.editedIncorrectAnswer3;

    console.log(questionId);
    console.log(incorrectResponse1);
    console.log(incorrectResponse3);

    await questionHelper.editQuestion(questionId, questionName, correctResponse, incorrectResponse1, incorrectResponse2, incorrectResponse3);
    res.redirect('/profile');
})

module.exports = router;