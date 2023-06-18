var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../helpers/identification');
const testSelector = require('../helpers/testSelector');
const testController = require('../helpers/testController');

/* GET Index page. */
router.get('/', (req, res) => {
    res.render('index');
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
    let tests = [];
    if(req.user){
        tests = await testSelector.getUserTests(req.user.id);
    }
    res.render('home',{userTests: tests});
})

router.post('/test', isLoggedIn, async (req, res) => {
    // Retrieve form data
    const testTitle = req.body.title;
    const testDescription = req.body.description;
    if(testTitle && req.user){
        let intCode = await testController.createInteractiveCode();
        await testSelector.createTest(testTitle, testDescription, intCode, req.user.id);
    }
    res.redirect('/home');
})

module.exports = router;