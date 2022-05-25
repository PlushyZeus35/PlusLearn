var express = require('express');
var router = express.Router();

/* GET Index page. */
router.get('/', (req, res) => {
    res.render('index', { isAuthenticated: req.isAuthenticated() })
})

/* GET test page. */
router.get('/test', (req, res) => {
    res.send('Hello World!');
})

/* GET example pug page. */
router.get('/pug', (req, res) => {
    res.render('sample', { isAuthenticated: req.isAuthenticated() })
})

module.exports = router;