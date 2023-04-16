var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../helpers/identification');
const testSelector = require('../helpers/testSelector');
const userSelector = require('../helpers/userSelector');

/* GET Index page. */
router.get('/', (req, res) => {
    res.render('editTest');
})

router.get('/s/:testId',async (req, res) => {
    const targetId = req.params.testId;
    if(targetId){
        const test = await testSelector.getTest(targetId);
        const user = await userSelector.getUserById(test.userId);
        res.render('test', {test: test, user: user});
    }
    
})

module.exports = router;