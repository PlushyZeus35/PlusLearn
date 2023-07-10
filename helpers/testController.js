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
        for(equestion of questionAnswers){
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
    const answersToInsert = [];

    for(let quest of allQuestions){
        if(quest.isDeleted){
            deletedQuestions.push(quest);
        }else if(quest.isNew){
            newQuestions.push(quest);
        }else if(quest.isUpdated){
            updatedQuestions.push(quest);
        }
    }

    console.log("TODAS");
    console.log(allQuestions);
    console.log("A BORRAR");
    console.log(deletedQuestions);
    console.log("A CREAR");
    console.log(newQuestions);
    console.log("A MODIFICAR");
    console.log(updatedQuestions);

    // Delete questions
    for(let delQuestion of deletedQuestions){
        questionsToDelete.push(delQuestion.id);
    }
    const deletedQuestionsAux = await questionSelector.deleteQuestionsAnswers(questionsToDelete);
    const deletedAnswersAux = await questionSelector.deleteQuestions(questionsToDelete);
    console.log("QUESTIONS BORRADAS");
    console.log(deletedQuestionsAux);
    console.log("ANSWERS BORRADAS");
    console.log(deletedAnswersAux);
   
    // Update questions
    for(let updQuestion of updatedQuestions){
        answersToInsert.length = 0;
        console.log("ACTUALIZAR ESTO");
        console.log(updQuestion)
        await questionSelector.updateQuestions(updQuestion.id, updQuestion.title, updQuestion.order);
        const answersDeletedd = await questionSelector.deleteQuestionsAnswers(updQuestion.id);
        console.log("BORRADAS LAS ANSWERS DE ESTA QUESTION");
        console.log(answersDeletedd);
        const correctAnswer = {
            title: updQuestion.correctAnswer.name,
            isCorrect: true,
            questionId: updQuestion.id
        }
        answersToInsert.push(correctAnswer);
        for(let incAns of updQuestion.incorrectAnswers){
            console.log("asfasdfasdf");
            console.log(incAns)
            const incAnswer = {
                title: incAns.name,
                isCorrect: false,
                questionId: updQuestion.id
            }
            answersToInsert.push(incAnswer);
        }
        const insertedAnswers = await questionSelector.createBulkAnswers(answersToInsert);
        console.log(insertedAnswers);
    }

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
    /*for(let i=0; i<newlyQuestions.length; i++){
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
    }*/
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