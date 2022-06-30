const databaseHelper = require('../lib/databaseHelper');
const answerHelper = {};

answerHelper.randomizeAnswers = (answers) => {
    answers.sort(()=> Math.random() - 0.5);
}
module.exports = answerHelper;