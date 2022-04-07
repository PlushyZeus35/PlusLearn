var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.send('Hello World!');
})

/* GET example pug page. */
router.get('/pug', (req, res) => {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
})

module.exports = router;