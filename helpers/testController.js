const questionSelector = require("./questionSelector");
const testSelector = require("./testSelector");
const Question = require('../models/question')
const Answer = require('../models/answer')
const testController = {};

testController.getFullTestInfo = async (testId) => {
    const responseType = {
        testId: 1,
        active: true,
        title: 'test title',
        description: 'test description',
        owner: 2,
        questions: [
            {
                id: 2,
                title: 'Title question',
                correctAnswer: 'correct answer',
                incorrectAnswers: ['incorrect answers', 'incorrect answers', 'incorrect answers']
            }
        ]
    }
    const test = await testSelector.getTest(testId);
    const questions = await questionSelector.getTestQuestions(testId);
    const questionsIds = [];
    for(let i=0; i<questions.length; i++){
        questionsIds.push(questions[i].id);
    }
    const answers = await questionSelector.getQuestionsAnswers(questionsIds);
    const fullTestInfo = {
        testId: testId,
        active: test.active,
        title: test.title,
        description: test.description,
        owner: test.userId,
        questions: []
    }
    for(let i=0; i<questions.length;i++){
        var questId = questions[i].id;
        const question = {
            id: questions[i].id,
            title: questions[i].title,
            order: questions[i].order,
            isNew: false,
            isDeleted: false
        }
        let questionAnswers = answers.filter((i) => i.questionId == questId);
        let correctAnswer = questionAnswers.filter((i) => i.isCorrect);
        let incorrectAnswers = questionAnswers.filter((i) => !i.isCorrect);
        question.correctAnswer = '';
        if(correctAnswer.length>0){
            question.correctAnswer = correctAnswer[0].title;
        }
        let incorrectArray = [];
        for(let i=0; i<incorrectAnswers.length; i++){
            incorrectArray.push(incorrectAnswers[i].title);
        }
        question.incorrectAnswers = incorrectArray;
        fullTestInfo.questions.push(question);
    }
    
    console.log(fullTestInfo);
    return fullTestInfo;
}

testController.updateTestData = async (testData) => {
    console.log(testData)
    await testSelector.updateTest(testData.testId,testData.title,testData.description,testData.active);
    let testQuestions = testData.questions;
    let questionsToCreate = [];
    let newlyQuestions = testQuestions.filter((i) => i.isNew);
    let deletedQuestions = testQuestions.filter((i) => i.isDeleted);
    let questionsToUpdate = testQuestions.filter((i) => i.isUpdated);

    //create questions
    for(let i=0; i<newlyQuestions.length; i++){
        let newQuestion = Question.build({
            title: newlyQuestions[i].title,
            order: newlyQuestions[i].order,
            testId: testData.testId
        },{isNewRecord: true})
        let questionInserted = await newQuestion.save();
        let questionInsertedId = questionInserted.id;

        let answer = Answer.build({
            title: newlyQuestions[i].correctAnswer,
            isCorrect: true,
            questionId: questionInsertedId
        },{isNewRecord: true});
        answer.save();

        answer = Answer.build({
            title: newlyQuestions[i].incorrectAnswers[0],
            isCorrect: false,
            questionId: questionInsertedId
        },{isNewRecord: true})
        answer.save();

        answer = Answer.build({
            title: newlyQuestions[i].incorrectAnswers[1],
            isCorrect: false,
            questionId: questionInsertedId
        },{isNewRecord: true})
        answer.save();

        answer = Answer.build({
            title: newlyQuestions[i].incorrectAnswers[2],
            isCorrect: false,
            questionId: questionInsertedId
        },{isNewRecord: true})
        answer.save();   
    }

    //update questions
    // Actualizamos la pregunta, eliminamos las respuestas y las volvemos a crear
    for(let i=0; i<questionsToUpdate.length; i++){
        let questionUpdatedId = questionsToUpdate[i].id;
        let question = Question.build({
            id: questionsToUpdate[i].id,
            title: questionsToUpdate[i].title,
            order: questionsToUpdate[i].order
        },{isNewRecord: false});
        question.save({fields: ['title','order']});
        await questionSelector.deleteQuestionsAnswers(questionUpdatedId);
        
        let answer = Answer.build({
            title: questionsToUpdate[i].correctAnswer,
            isCorrect: true,
            questionId: questionUpdatedId
        },{isNewRecord: true});
        answer.save();

        answer = Answer.build({
            title: questionsToUpdate[i].incorrectAnswers[0],
            isCorrect: false,
            questionId: questionUpdatedId
        },{isNewRecord: true})
        answer.save();

        answer = Answer.build({
            title: questionsToUpdate[i].incorrectAnswers[1],
            isCorrect: false,
            questionId: questionUpdatedId
        },{isNewRecord: true})
        answer.save();

        answer = Answer.build({
            title: questionsToUpdate[i].incorrectAnswers[2],
            isCorrect: false,
            questionId: questionUpdatedId
        },{isNewRecord: true})
        answer.save();   
    }
}

testController.createInteractiveCode = async () => {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    let numbers = '1234567890'.split('');
    let codeCharacters = alphabet.concat(numbers);
    let code = ''
    do{
        code = '';
        for(let i=0; i<6 ; i++){
            let random = Math.floor(Math.random() * codeCharacters.length);
            code += codeCharacters[random];
        } 
    }while(await testSelector.checkInteractiveCode(code).lenth>0)
    return code;
}
module.exports = testController;