var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const databaseHelper = require('../lib/databaseHelper');

router.get('/profile', isLoggedIn, async (req, res) => {
    let quizzes = await databaseHelper.getAllQuizzes();
    console.log(req.user);
    
    if(req.user.role == 1){
        res.render('teacher', {quizzes})
    }else if(req.user.role == 2){
        res.render('student', {quizzes})
    }
})


module.exports = router;