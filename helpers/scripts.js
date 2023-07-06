const https = require('https');
const testSelector = require('./testSelector');
const testController = require('./testController');
const questionSelector = require('./questionSelector');
const Answer = require('../models/answer')

async function setTriviaQuestions(number){
    console.log("CREACIONN")
    try{
        const triviaTestId = 20//await testSelector.createTest('Trivia quest v1!', 'Trivia questions from the trivia API!', '1010D', 12);
        
    }catch(error){
        console.log(error)
    }
    
    https.get('https://the-trivia-api.com/v2/questions', res => {
        let data = [];
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        console.log('Status Code:', res.statusCode);
        console.log('Date in Response header:', headerDate);

        res.on('data', chunk => {
            data.push(chunk);
        });

        res.on('end', async () => {
            console.log('Response ended: ');
            const questions = JSON.parse(Buffer.concat(data).toString());
            let index = 1;
            for(let question of questions) {
                
                console.log('PREGUNTA');
                const quest = question.question.text;
                const correct = question.correctAnswer;
                const incorrect1 = question.incorrectAnswers[0];
                const incorrect2 = question.incorrectAnswers[1];
                const incorrect3 = question.incorrectAnswers[2];
                const questionCreated = await questionSelector.setQuestion(20, index, quest);

                let answer = Answer.build({
                    title: correct,
                    isCorrect: true,
                    questionId: questionCreated.id
                },{isNewRecord: true});
                answer.save();

                answer = Answer.build({
                    title: incorrect1,
                    isCorrect: false,
                    questionId: questionCreated.id
                },{isNewRecord: true});
                answer.save();

                answer = Answer.build({
                    title: incorrect2,
                    isCorrect: false,
                    questionId: questionCreated.id
                },{isNewRecord: true});
                answer.save();

                answer = Answer.build({
                    title: incorrect3,
                    isCorrect: false,
                    questionId: questionCreated.id
                },{isNewRecord: true});
                answer.save();

                index++;
                console.log(question.question.text);
                console.log(question.correctAnswer)
                console.log(question.incorrectAnswers[0])
                console.log(question.incorrectAnswers[1])
                console.log(question.incorrectAnswers[2])
            }
        });
    }).on('error', err => {
        console.log('Error: ', err.message);
    });
}

module.exports = {setTriviaQuestions}