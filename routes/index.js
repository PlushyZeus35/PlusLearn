var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../helpers/identification');

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
router.get('/home', isLoggedIn, (req, res) => {
    res.render('home');
})

/*function isAuth(req , res , next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}*/

module.exports = router;