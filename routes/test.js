var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../helpers/identification');

/* GET Index page. */
router.get('/', (req, res) => {
    res.render('editTest');
})

module.exports = router;