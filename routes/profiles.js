var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const databaseHelper = require('../lib/databaseHelper');

router.get('/profile', isLoggedIn, async (req, res) => {
    let quizzes = await databaseHelper.getAllQuizzes();
    console.log(quizzes);
    res.render('teacher', {quizzes})
})


module.exports = router;