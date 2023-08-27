var express = require('express');
var router = express.Router();
const { isLoggedIn, apiIsLoggedIn } = require('../helpers/identification');
const testSelector = require('../helpers/testSelector');
const testController = require('../helpers/testController');
const {setTriviaQuestions} = require('../helpers/scripts');
const userSelector = require('../helpers/userSelector');
const userController = require('../helpers/userController');
/* GET Index page. */
router.get('/', (req, res) => {
    let authenticated = false;
    if(req.user){
        authenticated = true;
    }
    res.render('index', {isAuthenticated: authenticated});
})

router.get('/reset', (req, res) => {
    res.render('reset')
})

/* GET Login page. */
router.get('/login', (req, res) => {
    res.render('login');
})

/* GET Signup page. */
router.get('/register', (req, res) => {
    res.render('signup');
})

/* GET Home page. */
router.get('/home', isLoggedIn, async (req, res) => {
    //await setTriviaQuestions(5);
    res.render('home');
})

router.post('/test', isLoggedIn, async (req, res) => {
    // Retrieve form data
    const testTitle = req.body.title;
    const testDescription = req.body.description;
    let newTest;
    if(testTitle && req.user){
        let intCode = await testController.createInteractiveCode();
        newTest = await testSelector.createTest(testTitle, testDescription, intCode, req.user.id);
    }
    if(newTest){
        res.redirect(`/test/${newTest.id}`)
    }else{
        res.redirect('/home');
    }
})

router.post('/reset', async(req, res) => {
    const username = req.body.username;
    const user = await userSelector.getUser(username, username);
    if(user.length>0){
        // crear codigo y enviarlo por email
        const code = await userController.getPasswordResetCode(user[0].id, user[0].email);
        console.log(code)
        res.json({status: true, code: code})
    }else{
        res.json({status: false})
    }
})

router.get('/resetCode', async(req, res) => {
    const code = req.query.code;
    const codeRet = await userSelector.checkPasswordResetCode(code);
    if(codeRet.length>0){
        res.json({status: true});
    }else{
        res.json({status: false});
    }
})

router.post('/changePassword', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const code = req.body.code;
    console.log({username, password, code})
    if(await userController.updatePassword(password, code, username)){
        res.json({status:true})
    }else{
        res.json({status:false})
    }
})

router.get('/error', async(req, res) => {
    res.render('error');
})

router.get('/user/:id', isLoggedIn, async(req, res) => {
    const userId = req.params.id;
    const user = await userSelector.getUserById(userId);
    if(user){
        let isAuthUser = false;
        if(req.user &&  req.user.id == user.id){
            isAuthUser = true;
        }
        const parseUser = userController.parseUserData(user);
        const userTestStats = await testController.getUserTestStats(user.id);
        res.render('profile', {dataFromServer: {user: parseUser, isAuthUser: isAuthUser, stats: userTestStats}})
    }else{
        res.render('error')
    }
})

router.post('/user', apiIsLoggedIn, async(req, res) => {
    const {id, email} = req.body;
    if(req.user.id == id){
        const response = await userController.updateEmail(id, email);
        res.json(response)
    }else{
        res.json({status:false, errorText: 'unauthorithed'});
    }
    
})

router.delete('/user/:id', apiIsLoggedIn, async(req, res) => {
    const userId = req.params.id;
    if(userId == req.user.id){
        const response = await userController.deleteUser(userId);
        res.json(response)
    }else{
        res.json({status:false, errorText: 'unauthorithed'});
    }
})

module.exports = router;