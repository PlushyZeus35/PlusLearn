var express = require('express');
const passport = require('passport');
var router = express.Router();

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}));

module.exports = router;