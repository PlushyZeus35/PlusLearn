var express = require('express');
var router = express.Router();

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
router.get('/home', (req, res) => {
    res.render('home');
})

module.exports = router;