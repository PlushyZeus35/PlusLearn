var express = require('express');
var router = express.Router();
const { isLoggedIn, apiIsLoggedIn } = require('../helpers/identification');
const testSelector = require('../helpers/testSelector');
const userSelector = require('../helpers/userSelector');
const questionSelector = require('../helpers/questionSelector');
const testController = require('../helpers/testController');

// Edit test
router.get('/:testId',isLoggedIn, async (req, res) => {
    const targetId = req.params.testId;

    /*for(let i=0; i<questions.length; i++){
        const question = {
            id: questions[i].id,
            title: questions[i].title,
            answers: {
                correct: questions[i].,
                incorrect1: 'Respuesta incorrecta',
                incorrect2: 'Respuesta incorrecta2',
                incorrect3: 'Respuesta incorrecta3'
            },
            order: 1,
            isNew: false
        }
    }*/
    console.log(targetId)
    res.render('editTest', {test: targetId, dataFromServer: targetId});
})

// Get home page of test
router.get('/s/:testId',isLoggedIn,async (req, res) => {
    const targetId = req.params.testId;
    if(targetId){
        const test = await testSelector.getTest(targetId);
        const user = await userSelector.getUserById(test.userId);
        if(test.userId == req.user.id){
            res.redirect('../' + test.id)
        }else{
            res.render('testhome', {test: test, user: user});
        }
    }
})

// Do a test
router.get('/d/:testId', async (req, res) => {
    const testCode = req.params.testId;
    const test = await testSelector.checkInteractiveCode(testCode);
    let isMaster = false;
    let isAuthenticated = false;
    let username = '';
    if(test.length == 1){
        if(req.isAuthenticated()){
            isAuthenticated = true;
            username = req.user.username,
            isMaster = req.user.id == test[0].userId;
        }
        res.render('test', {dataFromServer: {userId: username, roomId: testCode, isAuthenticatedUser: isAuthenticated, isMaster: isMaster}});
    }else{
        res.render('error');
    }
})

// Get info of the test
router.get('/i/:testId',async (req, res) => {
    const targetId = req.params.testId;
    const questions = await questionSelector.getTestQuestions(targetId)
    res.json(questions)
})

// Create new answer from a test
router.post('/q',async (req, res) => {
    const targetId = req.body.testId;
    const questionName = req.body.name ? req.body.name : '';
    const order = req.body.order;
    const questions = await questionSelector.setQuestion(targetId, order, questionName);
    res.json(questions);
})

router.post('/edit', async (req, res) => {
    const targetId = req.body.testId;
    const active = req.body.active;
    const questions = req.body.questions;
    console.log(questions);
    
    res.json({});
})

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// Get info of the test
router.get('/getdata/:testId',apiIsLoggedIn , async (req, res) => {
    const targetId = req.params.testId;
    const response = await testController.getFullTestInfo(targetId);
    res.json(response)
})

// Save info of the test
router.post('/savedata/:testId',apiIsLoggedIn , async (req, res) => {
    const targetId = req.params.testId;
    const testData = req.body.data;
    testController.updateTestData(testData);
    res.json({})
})

module.exports = router;