var express = require('express');
var router = express.Router();

/* GET Index page. */
router.get('/', (req, res) => {
    res.render('index', { isAuthenticated: false })
})

/* GET test page. */
router.get('/test', (req, res) => {
    res.send('Hello World!');
})

/* GET example pug page. */
router.get('/pug', (req, res) => {
    res.render('sample', { title: 'Hey', message: 'Hello there!' })
})

module.exports = router;