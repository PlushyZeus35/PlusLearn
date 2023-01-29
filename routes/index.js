var express = require('express');
var router = express.Router();

/* GET Index page. */
router.get('/', (req, res) => {
    res.render('index');
})

module.exports = router;