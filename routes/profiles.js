var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../lib/auth');

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile')
})


module.exports = router;