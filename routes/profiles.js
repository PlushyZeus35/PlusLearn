var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const databaseHelper = require('../lib/databaseHelper');
const quizHelper = require('../lib/quizHelper');

router.get('/profile', isLoggedIn, async (req, res) => {
    let quizzes = await quizHelper.getOtherUserQuizzes(req.user.id);
    let myquizzes = await quizHelper.getQuizzesFromUser(req.user.id);
    console.log(myquizzes);
    console.log(quizzes);
    res.render('profile', {myquizzes, quizzes})
})


module.exports = router;