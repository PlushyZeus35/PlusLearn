var express = require('express');
var router = express.Router();
const { isLoggedIn, apiIsLoggedIn } = require('../helpers/identification');
const testSelector = require('../helpers/testSelector');
const userSelector = require('../helpers/userSelector');
const questionSelector = require('../helpers/questionSelector');
const testController = require('../helpers/testController');
const responseSelector = require('../helpers/responsesSelector');

// Edit test
router.get('/:testId',isLoggedIn, async (req, res) => {
    const targetId = req.params.testId;
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
    let userId = null;
    let username = '';
    if(test.length == 1){
        if(req.isAuthenticated()){
            isAuthenticated = true;
            username = req.user.username,
            isMaster = req.user.id == test[0].userId;
            userId = req.user.id;
        }
        res.render('test', {dataFromServer: {username: username, roomId: testCode, isAuthenticatedUser: isAuthenticated, isMaster: isMaster, userId: userId, testId: test[0].id, testTitle: test[0].title, testDescription: test[0].description}});
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

// Get info of the test
router.get('/getdata/:testId',apiIsLoggedIn , async (req, res) => {
    const targetId = req.params.testId;
    const response = await testController.getFullTestInfo(targetId);
    res.json(response)
})

// Save info of the test
router.post('/savedata/:testId', apiIsLoggedIn, async (req, res) => {
    const targetId = req.params.testId;
    const testData = req.body.data;
    testController.updateTestData(testData);
    res.json({})
})

router.get('/g/getUserTests', apiIsLoggedIn, async(req, res) => {
    const userId = req.user.id;
    const tests = await testController.getUserTests(userId, 5);
    let showMoreLink = false;
    if(tests.length==5){
        showMoreLink = true;
        tests.pop();
    }
    res.json({status: true, tests: tests, showMoreLink: showMoreLink})
})

router.get('/all/getUserTests', apiIsLoggedIn, async(req, res) => {
    const userId = req.user.id;
    const tests = await testController.getUserTests(userId, Infinity);
    res.json({status: true, tests: tests})
})

router.get('/stats/:testId', isLoggedIn, async(req, res) => {
    const targetId = req.params.testId;
    if(targetId){
        const test = await testSelector.getTest(targetId);
        if(test && test.userId == req.user.id){
            const testInfo = await testController.parseTestData(test);
            res.render('stats', {dataFromServer: {test: testInfo}});
        }else{
            res.render('error');
        }
    }else{
        res.render('error')
    }
})

router.get('/qstats/:testId', isLoggedIn, async(req, res) => {
    const targetId = req.params.testId;
    if(targetId){
        const test = await testSelector.getTest(targetId);
        if(test && test.userId == req.user.id){
            const testInfo = await testController.parseTestData(test);
            res.render('completestats', {dataFromServer: {test: testInfo}});
        }else{
            res.render('error');
        }
    }else{
        res.render('error')
    }
})

router.get('/getGeneralStadistic/:testId', apiIsLoggedIn, async(req, res) => {
    const testId = req.params.testId;
    const generalStadistics = await testController.getGeneralStadistics(testId);
    res.json(generalStadistics);
})

router.get('/getQuestionsStadistics/:testId', apiIsLoggedIn, async(req, res) => {
    const testId = req.params.testId;
    const questionsStadistics = await testController.getQuestionsStadistics(testId);
    res.json(questionsStadistics);
})

router.get('/responses/:testId', isLoggedIn, async(req, res) => {
    const targetId = req.params.testId;
    const test = await testSelector.getTest(targetId);
    if(test && test.userId == req.user.id){
        const testInfo = await testController.parseTestData(test);
        res.render('responses', {dataFromServer: {test: testInfo}});
    }else{
        res.render('error');
    }
})

router.get('/useresponses/:testId', apiIsLoggedIn, async(req, res) => {
    const targetId = req.params.testId;
    const userResponses = await testController.getUserResponses(targetId);
    res.json(userResponses);
})

router.post('/saveResults', async(req, res) => {
    const resp = req.body.responses;
    const userResponseMap = new Map();
    const testResponseList = [];
    for(let respu of resp){
        console.log("Respuesta")
        console.log(respu);
        for(let answe of respu.answers){
            if(userResponseMap.has(answe.user)){
                userResponseMap.get(answe.user).push(answe);
            }else{
                userResponseMap.set(answe.user, [answe]);
            }
        }
    }
    for (const [username, answers] of userResponseMap.entries()) {
        const userId = answers[0].userId;
        const testId = answers[0].testId;
        const isGuestUser = answers[0].isGuestUser;
        // isGuest	username	score	userId	testId	
        const newTestResponse = {
            isGuest: isGuestUser,
            username: username,
            score: 0,
            userId: userId,
            testId: testId
        }
        testResponseList.push(newTestResponse);
        const testResponseCreated = await responseSelector.createBulkTestResponses(testResponseList);
        testResponseList.length=0;
        console.log(testResponseCreated);
        const answerListToInsert = [];
        console.log("ASDF");
        console.log(answers);
        console.log(answers[0])
        console.log("tESTRESPONSEID");
        console.log( testResponseCreated[0].id);
        for(let answer of answers){
            //	answerId	questionId	testresponseId	
            const newResponse = {
                answerId: answer.id,
                questionId: answer.questionId,
                testresponseId: testResponseCreated[0].id
            }
            answerListToInsert.push(newResponse);
        }
        await responseSelector.createBulkResponses(answerListToInsert);
    }

    res.json({status: true})
})

module.exports = router;