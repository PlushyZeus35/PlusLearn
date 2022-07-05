var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const databaseHelper = require('../lib/databaseHelper');
const quizHelper = require('../lib/quizHelper');
const externApis = require('../lib/externApis');
const chartsConf = require('../lib/chartsConf');
const responseHelper = require('../lib/responseHelper');
const userHelper = require('../lib/userHelper');

router.get('/profile', isLoggedIn, async (req, res) => {
    if(req.user.role == 2){
        res.redirect('/admin');
    }
    let quizzes = await quizHelper.getOtherUserQuizzes(req.user.id);
    let myquizzes = await quizHelper.getQuizzesFromUser(req.user.id);
    console.log(myquizzes);
    console.log(quizzes);
    res.render('profile', {myquizzes, quizzes})
})

router.get('/admin', isLoggedIn, async (req, res) => {
    var responsesLabels = [];
    var responsesData = [];
    var usersData = [];
    const responsesInfo = await responseHelper.getSevenDayCountResponses();
    const regularUser = await databaseHelper.howManyUsers();
    const adminUser = await databaseHelper.howManyAdmins();
    const usersInfo = [regularUser, adminUser];
    const newUsers = await userHelper.getSevenDayCountUsers();  
    responsesInfo.forEach(function(response){
        responsesLabels.push(response.date);
        responsesData.push(response.counter);
    })

    newUsers.forEach(function(user){
        usersData.push(user.counter);
    })

    console.log("A");
    console.log(newUsers);
    res.render('admin_stats', {usersInfo, responsesLabels, responsesData, usersData});
})


module.exports = router;