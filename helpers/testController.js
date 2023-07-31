const questionSelector = require("./questionSelector");
const testSelector = require("./testSelector");
const Question = require('../models/question')
const Answer = require('../models/answer');
const {DateTime} = require('luxon');
const responseSelector = require("./responsesSelector");
const emailController = require('./emailController');
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
                correctAnswer: 'object answer',
                incorrectAnswers: ['object answers']
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
        interactiveCode: test.interactiveCode,
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
        
        if(correctAnswer.length>0){
            let correct_answer = {
                id: correctAnswer[0].id,
                name: correctAnswer[0].title
            }
            question.correctAnswer = correct_answer;
        }
        let incorrectArray = [];
        for(let i=0; i<incorrectAnswers.length; i++){
            let incorrect_answer = {
                id: incorrectAnswers[i].id,
                name: incorrectAnswers[i].title
            }
            incorrectArray.push(incorrect_answer);
        }
        question.incorrectAnswers = incorrectArray;
        fullTestInfo.questions.push(question);
    }
    
    //console.log(fullTestInfo);

    return fullTestInfo;
}

testController.getFullTestInfoAnon = async (testId) => {
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
                correctAnswer: 'object answer',
                incorrectAnswers: ['object answers']
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

        let t_answers = [];
        for(let equestion of questionAnswers){
            let answer = {
                id: equestion.id,
                name: equestion.title
            }
            t_answers.push(answer);
        }
        t_answers = shuffleArray(t_answers);

        question.answers = t_answers;
        fullTestInfo.questions.push(question);
    }
    
    console.log(fullTestInfo);
    return fullTestInfo;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

// Method to update the test data when usign the test editor
// This method creates the new test given with isNew attribute activated
// Delete the tests with the isDeleted attribute activated
// Update the tests with the isUpdated attribute activated
testController.updateTestData = async (testData) => {
    await testSelector.updateTest(testData.testId,testData.title,testData.description,testData.active);
    
    const allQuestions = testData.questions;

    const deletedQuestions = [];
    const newQuestions = [];
    const updatedQuestions = [];

    const questionsToDelete = [];
    const answersToUpdate = [];

    for(let quest of allQuestions){
        if(quest.isDeleted){
            deletedQuestions.push(quest);
        }else if(quest.isNew){
            newQuestions.push(quest);
        }else if(quest.isUpdated){
            updatedQuestions.push(quest);
        }
    }

    // Delete questions
    for(let delQuestion of deletedQuestions){
        questionsToDelete.push(delQuestion.id);
    }
    const deletedQuestionsAux = await questionSelector.deleteQuestionsAnswers(questionsToDelete);
    const deletedAnswersAux = await questionSelector.deleteQuestions(questionsToDelete);
   
    // Update questions
    for(let updQuestion of updatedQuestions){
        await questionSelector.updateQuestions(updQuestion.id, updQuestion.title, updQuestion.order);
        const correctAnswer = {
            id: updQuestion.correctAnswer.id,
            title: updQuestion.correctAnswer.name
        }
        answersToUpdate.push(correctAnswer);
        for(let incAns of updQuestion.incorrectAnswers){
            const incAnswer = {
                id: incAns.id,
                title: incAns.name
            }
            answersToUpdate.push(incAnswer);
        }
    }
    await questionSelector.bulkUpdateAnswers(answersToUpdate);

    //create questions
    for(let newQuest of newQuestions){
        const qId = await questionSelector.setQuestion(testData.testId, newQuest.order, newQuest.title);
        const answersToInsert = [];
        answersToInsert.push({title: newQuest.correctAnswer.name, isCorrect: true, questionId: qId.id});
        answersToInsert.push({title: newQuest.incorrectAnswers[0].name, isCorrect: false, questionId: qId.id})
        answersToInsert.push({title: newQuest.incorrectAnswers[1].name, isCorrect: false, questionId: qId.id})
        answersToInsert.push({title: newQuest.incorrectAnswers[2].name, isCorrect: false, questionId: qId.id})
        const insertedAnswers = await questionSelector.createBulkAnswers(answersToInsert);
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

testController.getCorrectAnswer = async (questionId) => {
    const answers = await questionSelector.getQuestionsAnswers(questionId);
    const correctAnswer = answers.filter((i) => i.isCorrect);
    return correctAnswer;
}

testController.parseTestData = async(test) => {
    const updatedDate = new Date(test.updatedAt);
    const createdDate = new Date(test.createdAt);
    const updatedtimeStamp = DateTime.fromISO(updatedDate.toISOString()).setLocale('es').toRelativeCalendar();
    const createdtimeStamp = DateTime.fromISO(createdDate.toISOString()).setLocale('es').toRelativeCalendar();
    const testInfo = {
        id: test.id,
        title: test.title,
        description: test.description,
        active: test.active,
        updatedTimestamp: updatedtimeStamp,
        createdTimestamp: createdtimeStamp,
        interactiveCode: test.interactiveCode
    }

    return testInfo;
}

testController.getQuestionsStadistics = async(testId) => {
    const questionMap = new Map();
    const answersCounterMap = new Map();
    const testQuestions = await questionSelector.getTestQuestions(testId);
    const questionIds = [];
    const testResponsesIds = [];
    const correctAnswersIds = [];
    for(let testQuestion of testQuestions){
        questionMap.set(testQuestion.id, {correct: 0, incorrect: 0, empty: 0, order: testQuestion.order});
        questionIds.push(testQuestion.id);
    }
    const questionCounter = questionIds.length;
    const correctAnswers = await questionSelector.getCorrectAnswers(questionIds);
    console.log("RESPUESTAS CORRECTAS");
    for(let correctAnswer of correctAnswers){
        correctAnswersIds.push(correctAnswer.id);
    }
    console.log(correctAnswersIds);
    const testResponses = await responseSelector.getTestResponses(testId);
    for(let testResponse of testResponses){
        testResponsesIds.push(testResponse.id);
    }
    console.log("MAPA")
    console.log(questionMap)
    const userResponses = await responseSelector.getUserResponses(testResponsesIds);
    for(let userResponse of userResponses){
        console.log("ANALISIS " + userResponse.questionId)
        if(userResponse.answerId==null){
            console.log("EMPTY")
            questionMap.get(userResponse.questionId).empty++;
        }else if(correctAnswersIds.includes(userResponse.answerId)){
            console.log("CORRECTA " + userResponse.answerId);
            console.log(correctAnswersIds.indexOf(userResponse.answerId));
            questionMap.get(userResponse.questionId).correct++;
        }else{
            console.log("INCORRECTA " + userResponse.answerId)
            questionMap.get(userResponse.questionId).incorrect++;
        }
        if(answersCounterMap.has(userResponse.answerId)){
            answersCounterMap.get(userResponse.answerId).counter++;
        }else{
            answersCounterMap.set(userResponse.answerId, {counter: 1});
        }
    }
    console.log(questionMap);
    const questionStats = {
        questionCounter: questionCounter,
        validationCounter: [],
        answersCounter: []
    };
    for (const [key, value] of questionMap.entries()) {
        const stat = {
            questionId: key,
            correct: value.correct,
            incorrect: value.incorrect,
            empty: value.empty,
            order: value.order
        }
        questionStats.validationCounter.push(stat);
    }
    for (const [key, value] of answersCounterMap.entries()) {
        const astat = {
            answerId: key,
            counter: value.counter
        }
        questionStats.answersCounter.push(astat);
    }
    return questionStats;
}

testController.getUserResponses = async(testId) => {
    const testResponsesIds = [];
    const answersIds = [];
    const questionsIds = [];
    const testResponses = await responseSelector.getTestResponses(testId);
    for(let testResp of testResponses){
        testResponsesIds.push(testResp.id);
    }
    const userResponses = await responseSelector.getUserResponses(testResponsesIds);
    const responses = [];
    for(let testResp of testResponses){
        const resp = {
            id: testResp.id,
            user: testResp.username,
            isGuest: testResp.isGuest,
            responses: []
        }
        const targetResponses = userResponses.filter((i) => i.testresponseId == testResp.id);
        for(let ttResponse of targetResponses){
            questionsIds.push(ttResponse.questionId);
            if(ttResponse.answerId!=null)
                answersIds.push(ttResponse.answerId);
            const usResp = {
                id: ttResponse.answerId,
                questionId: ttResponse.questionId
            }
            resp.responses.push(usResp);
        }
        responses.push(resp);
    }
    const answersInfo = await questionSelector.getAnswers(answersIds);
    const questionsInfo = await questionSelector.getQuestions(questionsIds);
    for(let finalResponse of responses){
        for(let finalUserResp of finalResponse.responses){
            const ansInf = finalUserResp.id != null ? answersInfo.filter((i) => i.id == finalUserResp.id)[0] : null;
            const queInf = questionsInfo.filter((i) => i.id == finalUserResp.questionId)[0];
            finalUserResp.title = ansInf != null ? ansInf.title : null;
            finalUserResp.isCorrect = ansInf != null ? ansInf.isCorrect : false;
            finalUserResp.questionTitle = queInf.title;
            finalUserResp.isEmpty = finalUserResp.id == null;
        }
    }
    return {responses:responses}
}

testController.getGeneralStadistics = async(testId) => {
    let responsesCounter = 0;
    let typeUserCounter = {
        register: 0,
        guest: 0
    }
    // Numero de respuestas recibidas
    // Tipos de usuarios 
    const testResponses = await responseSelector.getTestResponses(testId);
    for(let testResponse of testResponses){
        responsesCounter++;
        if(testResponse.isGuest){
            typeUserCounter.guest++;
        }else{
            typeUserCounter.register++;
        }
    }
    return {responsesCounter, typeUserCounter};
}

testController.getUserTests = async(userId, counter) => {
    try{
        const userTests = await testSelector.getUserTests(userId);
    }catch(e){
        console.log(e);
        emailController.sendEmail('plushyzeus35@gmail.com', 'error', e.message);
    }
    
    const testList = [];
    for(let test of userTests){
        if(testList.length < counter){
            const eDate = new Date(test.updatedAt);
            const timeStamp = DateTime.fromISO(eDate.toISOString()).toRelativeCalendar();
            const eTest = {
                id: test.id,
                title: test.title,
                description: test.description,
                timeStamp: timeStamp,
                interactiveCode: test.interactiveCode
            }
            testList.push(eTest);
        }
    }
    return testList;
}

testController.getUsersResults = async (roomInfo, userAnswers) => {
    const results = initialiceResultArray(roomInfo.users); // { userId, correctCounter }
    const testInfo = await testController.getFullTestInfo(roomInfo.testId);
    const testQuestions = testInfo.questions;
    for(let testQuestion of testQuestions){
        const correctAnswers = testQuestion.correctAnswer;
        const qAnswers = userAnswers.filter((i) => i.questionId == testQuestion.id)[0].answers;
        for(let userAnswer of qAnswers){
            // userAnswer = id, name, questionId, user
            // correctAnswers = [{id, name}]
            //let cc = correctAnswers.filter((i) => i.id == userAnswer.id);
            if(correctAnswers.id == userAnswer.id){
                const rr = results.filter((i) => i.user == userAnswer.user);
                if(rr.length>0){
                    rr[0].correctCounter++;
                }
            }
        }
    }

    console.log("CORRECT COUNTER");
    console.log(results);
    return results;
}

function initialiceResultArray(users){
    const results = [];
    for(let user of users){
        const rUser = {
            user: user,
            correctCounter: 0
        }
        results.push(rUser);
    }
    return results;
}
module.exports = testController;