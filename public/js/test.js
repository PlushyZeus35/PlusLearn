const TOAST_SUCCESS = 'toast-success';
const TOAST_FAIL = 'toast-fail';

// questions of the test
let testQuestions = [];
// actual questionid
let targetQuestionId;
// actual question order number (the index of the testQuestions array)
let index = 0;
// Differentiate phases
let sessionPhase = true;
// Room info from the server
let roomInfo;
let isMasterUser = false;
// Test info from the server
let testInfo;
let testTitle;
let testDescription;
// Correct answers group by question id
let correctAnswers = new Map();
// Answers received from other users
let answersReceived = new Map();
// My answers
let myAnswers = new Map();
// Boolean to check if user has answered the actual question
// Used to alert master
let hasAnswered = false;
// User answered
let userAnswered = 0;
let qrCodeIsRendered = false;

// SOCKET EVENTS
const CONNECT_EVENT = 'room-connection';
const RECEIVECONNECTION_EVENT = 'userconnect';
const START_EVENT = 'start-test';
const END_QUESTION = 'end-question';
const NEXT_QUESTION = 'next-question';
const SEND_ANSWER = 'send-answer';
const END_TEST = 'end-test';
const USER_ANSWERED = 'user-answered';
const USER_ALREADY_EXISTS = 'user-exists';
const TEST_HAS_STARTED = 'test-started';
const MASTER_OUT = 'master-out';
const myModal = new bootstrap.Modal('#staticBackdrop', {
    keyboard: false
})
const qrModal = new bootstrap.Modal('#qrCodeModal')


//loadQuestions();
// Init bootstrap

// Init socket events
var socket = io();
/**
 * Event to receive the connection status of a user to the actual room.
 * This re-render the user list and displays a notifications with the new user info
 * @param {object} roomInfoS - Info of the connection status.
 */
socket.on(RECEIVECONNECTION_EVENT, (roomInfoS) => {
    if(sessionPhase){
        myModal.hide();
        showLoader();
        roomInfo = roomInfoS.roomInfo;
        const targetUser = roomInfoS.userTarget;
        // Show notification to user
        if(targetUser.isNew){
            showNotification(TOAST_SUCCESS, 'Usuario conectado', targetUser.name + ' se ha conectado');
        }else{
            showNotification(TOAST_FAIL, 'Usuario desconectado', targetUser.name + ' se ha desconectado');
        }
        showUsersTable();
    }
})

/**
 * Event the user receives when try to connect to a test that has started.
 */
socket.on(TEST_HAS_STARTED, (empty) => {
    // This test has started 
    myModal.hide();
    hideAll();
    const mainContainer = $('#mainContainer')[0];
    const alertContainer = document.createElement('div')
    alertContainer.classList.add('container');
    alertContainer.classList.add('mt-4');

    const infoAlert = document.createElement('div');
    infoAlert.classList.add('alert');
    infoAlert.classList.add('warningAlert');
    infoAlert.role = 'alert';
    const alertHeading = document.createElement('h4');
    alertHeading.classList.add('alert-heading');
    alertHeading.innerHTML = '¡Este cuestionario ya ha comenzado!';
    const alertText = document.createElement('p');
    alertText.innerHTML = 'El maestro de sala ha dado comienzo del cuestionario, no es posible unirse a un cuestionario que ha dado comienzo.';
   
    infoAlert.appendChild(alertHeading);
    infoAlert.appendChild(alertText);
    alertContainer.appendChild(infoAlert);

    mainContainer.appendChild(alertContainer)
})

/**
 * Event to receive when the username specified from a guest user is repeated.
 * When a guest user try to connect with a existing username, it displays an alert on screen.
 */
socket.on(USER_ALREADY_EXISTS, (empty) => {
    const alertDiv = $("#userRepAlert");
    if(alertDiv.length==0){
        const alertContainer = $("#alertContainer")[0];
        const alert = document.createElement('div');
        alert.classList.add('alert');
        alert.classList.add('alert-danger');
        alert.role = 'alert';
        alert.innerHTML = 'Ese nombre de usuario ya existe en la plataforma, especifica otro por favor.';
        alert.id = 'userRepAlert';
        alertContainer.appendChild(alert);
    } 
})

/**
 * Event to receive when the master user exits the room.
 * When the master user has disconnected from the room, the interactive test ends with no data save.
 */
socket.on(MASTER_OUT, (empty) => {
    hideAll();
    const masterContent = $("#mainContainer")[0];
    const alertContainer = document.createElement('div')
    alertContainer.classList.add('container');
    alertContainer.classList.add('mt-4');

    const infoAlert = document.createElement('div');
    infoAlert.classList.add('alert');
    infoAlert.classList.add('warningAlert');
    infoAlert.role = 'alert';
    const alertHeading = document.createElement('h4');
    alertHeading.classList.add('alert-heading');
    alertHeading.innerHTML = '¡El cuestionario ha terminado!';
    const alertText = document.createElement('p');
    alertText.innerHTML = 'El maestro de sala ha abandonado el cuestionario. Puedes abandonar la sala cuando quieras o recarga la página para volver a comenzar.';
   
    infoAlert.appendChild(alertHeading);
    infoAlert.appendChild(alertText);
    alertContainer.appendChild(infoAlert);

    mainContainer.appendChild(alertContainer)
})

/**
 * Event to receive an alert when a user has check an answer in the question.
 * This is needed to display on screen the users left to answer the question.
 */
socket.on(USER_ANSWERED, ()=>{
    let userCounterSpan = $("#userCounterSpan");
    if(userCounterSpan.length>0){
        userCounterSpan = userCounterSpan[0];
        userAnswered--;
        if(userCounterSpan==1){
            userCounterSpan.innerHTML = userAnswered + ' persona ';
        }else{
            userCounterSpan.innerHTML = userAnswered + ' personas ';
        }
    }
});

/**
 * Event to start the test.
 * We receive all questions info and start to display the first question.
 * @param {object} testInfo - Info of interactive test. It contains all the questions and possible answers.
 */
socket.on(START_EVENT, (testInfo) => {
    testInfo = testInfo;
    testQuestions = testInfo.questions;
    testQuestions.sort(sortByOrder);
    sessionPhase=false;
    hideAll();
    showNextQuestion();
})

/**
 * Event to receive when the interactive test has finished.
 * It displays the final results on screen.
 * @param {object} results - Results of the interactive test.
 */
socket.on(END_TEST, (results) => {
    hideAll();
    const mainContainer = $('#mainContainer')[0];
    const userContainer = document.createElement('div');
    userContainer.classList.add('container');
    userContainer.classList.add('rounded');
    userContainer.classList.add('mt-3');
    userContainer.classList.add('p-3');
    userContainer.classList.add('containerInfo');

    results.sort(sortByCorrectQuestions);
    results.reverse();

    const resultsAlert = getResultsAlert();
    userContainer.appendChild(resultsAlert);

    const partContainer = document.createElement('div');
    partContainer.classList.add('studentContainer');
    const title = document.createElement('h3');
    title.innerHTML = 'Resultados';
    title.classList.add('text-center');
    title.classList.add('mainTitle');
    title.classList.add('text-white');

    const saveButton = document.createElement('button');
    saveButton.id = 'saveDataButton';
    saveButton.classList.add('btn');
    saveButton.classList.add('btn-primary');
    saveButton.classList.add('mt-3');
    saveButton.onclick = saveResults;
    saveButton.innerHTML = 'Guardar resultados';

    partContainer.appendChild(title);
    partContainer.appendChild(getResultTable(results));
    if(isMasterUser){
        partContainer.appendChild(saveButton);
    }
    userContainer.appendChild(partContainer);
    mainContainer.appendChild(userContainer);
})

/**
 * Event to receive the answers from the rest of users and the correct answer of current question.
 * @param {object} answers - Correct answer and selected answers of rest of users from current question.
 */
socket.on(SEND_ANSWER, (answers) => {
    answersReceived.set(targetQuestionId, answers.userAnswers);
    correctAnswers.set(targetQuestionId, answers.correct);
    showResults();
})

/**
 * Event to display next question to users
 */
socket.on(NEXT_QUESTION, (info) => {
    index++;
    hideAll();
    showNextQuestion();
})

/**
 * Event to end the current question.
 * Need to catch the user selected answer and send it to the rest of users.
 */
socket.on(END_QUESTION, (info) => {
    if(!isMasterUser){ 
        const inputs = $(".user-answer");
        let selectedAnswer = {
            question: testQuestions.filter((i) => i.id == targetQuestionId)[0]
        }
        let selectedAnswerId;
        for(let input of inputs){
            if(input.checked){
                selectedAnswer.selectedAnswer = {
                    isNull: false,
                    id: input.id,
                    name: input.value,
                    questionId: targetQuestionId,
                    user: connectionInfo.username,
                    userId: dataFromServer.userId,
                    isGuestUser: !dataFromServer.isAuthenticatedUser,
                    testId: dataFromServer.testId
                }
                selectedAnswerId = parseInt(input.id);
            }
        }
        if(selectedAnswer.selectedAnswer==null){
            selectedAnswer.selectedAnswer = {
                isNull: true,
                questionId: targetQuestionId,
                user: connectionInfo.username,
                userId: dataFromServer.userId,
                isGuestUser: !dataFromServer.isAuthenticatedUser,
                testId: dataFromServer.testId
            }
        }
        myAnswers.set(targetQuestionId, selectedAnswerId);
        selectedAnswer.userId = connectionInfo.username;
        selectedAnswer.roomId = connectionInfo.roomId;
        sendEvent(SEND_ANSWER, selectedAnswer);
    }
})

/**
 * Custom sort algorithm.
 * This method is used inside a sort() method to sort user list by correct question counter.
 * @param {number} a - First response object to compare
 * @param {number} b - Second response object to compare
 * @returns {boolean} - Boolean to use inside the sort method.
 */
function sortByCorrectQuestions(a, b) {
    // Compare based on the 'name' property
    if (a.correctCounter < b.correctCounter) {
      return -1;
    } else if (a.correctCounter > b.correctCounter) {
      return 1;
    } else {
      // If names are equal, compare based on the 'age' property
      if (a.correctCounter < b.correctCounter) {
        return -1;
      } else if (a.correctCounter > b.correctCounter) {
        return 1;
      } else {
        return 0;
      }
    }
  }

/**
 * Custom sort algorithm.
 * This method is used inside a sort() method to sort question list by order.
 * @param {number} a - First quesiton object to compare
 * @param {number} b - Second question object to compare
 * @returns {boolean} - Boolean to use inside the sort method.
 */
function sortByOrder(a, b) {
    // Compare based on the 'name' property
    if (a.order < b.order) {
      return -1;
    } else if (a.order > b.order) {
      return 1;
    } else {
      // If names are equal, compare based on the 'age' property
      if (a.order < b.order) {
        return -1;
      } else if (a.order > b.order) {
        return 1;
      } else {
        return 0;
      }
    }
  }

const connectionInfo = {
    roomId: dataFromServer.roomId,
    username: dataFromServer.username
}
init();

/**
 * Create the results alert
 * @returns {DOM} - Alert to display on screen in the results list.
 */
function getResultsAlert(){
    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    alertContainer.classList.add('mb-2');
    const infoAlert = document.createElement('div');
    infoAlert.classList.add('alert');
    infoAlert.classList.add('infoAlert');
    infoAlert.role = 'alert';
    const alertHeading = document.createElement('h4');
    alertHeading.classList.add('alert-heading');
    alertHeading.innerHTML = '¡Aquí están los resultados del cuestionario!';
    const alertText = document.createElement('p');
    alertText.innerHTML = 'Han llegado los resultados del cuestionario. Justo debajo podrás ver la clasificación de usuarios y su correspondiente puntuación.';
    const alertSeparator = document.createElement('hr');
    const alertSubtext = document.createElement('p');
    if(isMasterUser){
        alertSubtext.innerHTML = 'Podrás guardar los resultados de este cuestionario para que conste en estadísticas y análisis.';
    }else{
        alertSubtext.innerHTML = 'Puedes abandonar la sala cuando quieras.';
    }
    alertSubtext.classList.add('mb-0');
    infoAlert.appendChild(alertHeading);
    infoAlert.appendChild(alertText);
    infoAlert.appendChild(alertSeparator);
    infoAlert.appendChild(alertSubtext);
    alertContainer.appendChild(infoAlert);
    return alertContainer;
}

/**
 * Initializacion method
 * It displays loader, try to connect to socket room and init some parameters.
 */
function init(){
    testTitle = dataFromServer.testTitle;
    testDescription = dataFromServer.testDescription;
    hideAll();
    let username = dataFromServer.username;
    let roomId = dataFromServer.roomId;
    isMasterUser = dataFromServer.isMaster;
    if(username==null || username == ''){
        isMasterUser=false;
        myModal.show();
    }else{
        showLoader();
        connectToRoom(connectionInfo.roomId, connectionInfo.username, false)
    }
}

/**
 * Method to try to connecto to a socket room
 * @param {string} roomId - room code to connect
 * @param {string} username - username of the user to connect
 * @param {boolean} isGuestUser - Boolean to check if the user is not logued in
 */
function connectToRoom(roomId, username, isGuestUser){
    const connectionInfo = {
        roomId: roomId,
        username: username,
        isGuestUser: isGuestUser
    }
    socket.emit(CONNECT_EVENT, connectionInfo);
}

/**
 * Hide all contents inside main container
 */
function hideAll(){
    const mainContainer = $('#mainContainer')[0];
    mainContainer.innerHTML = '';
}

/**
 * Method to try to connect if the user is a guest user and has selected a temporal username in the modal screen.
 */
function setGuestUser(){
    const nameInput = $('#guestNameInput')[0];
    if(nameInput.value!=''){
        connectionInfo.username = nameInput.value;
        
        connectToRoom(connectionInfo.roomId, connectionInfo.username, true)
    }
}

/**
 * Displays the loader animation in the main container
 */
function showLoader(){
    hideAll();
    // General container
    const mainContainer = $('#mainContainer')[0];
    // Loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('loaderContainer');
    loaderContainer.classList.add('mt-4');
    // Loader animation
    const loadingAnimation = document.createElement('div');
    loadingAnimation.id = 'loadingAnimation';
    // Loader title
    const loadingTitle = document.createElement('h2');
    loadingTitle.classList.add('text-center');
    loadingTitle.innerHTML = 'Cargando...';

    loaderContainer.appendChild(loadingAnimation);
    loaderContainer.appendChild(loadingTitle);

    mainContainer.appendChild(loaderContainer);

    let animation = bodymovin.loadAnimation({
        container: document.getElementById('loadingAnimation'),
        path: '/static/lottie/loading.json',
        render: 'svg',
        loop: true,
        autoplay: true,
        name: 'animation name'
    })
}

/**
 * Displays the user table. It shows all users in the waiting room.
 */
function showUsersTable(){
    hideAll();
    const mainContainer = $('#mainContainer')[0];
    const testInfoContainer = getTestInfoContainer();
    mainContainer.appendChild(testInfoContainer)
    const userList = getUserList();
    mainContainer.appendChild(userList);
}

/**
 * Method to create the list of users to display in the waiting room
 * @returns {DOM} user list connected in the room to display in screen.
 */
function getUserList(){
    const userList = document.createElement('div');
    userList.classList.add('mt-4');
    userList.id = 'userList';

    const userListTitle = document.createElement('h3');
    userListTitle.classList.add('ubuntuFont');
    userListTitle.innerHTML = 'Participantes';
    userList.appendChild(userListTitle);

    if(roomInfo.master != null && roomInfo.master!=''){
        const master = document.createElement('div');
        master.classList.add('user');
        master.classList.add('master');
        const masterName = document.createElement('div');
        masterName.classList.add('username');
        masterName.innerHTML = roomInfo.master;
        const masterType = document.createElement('div');
        masterType.classList.add('usertype');
        const typeImg = document.createElement('img');
        typeImg.src = '/static/icons/check-circle-fill-blue.svg';
        masterType.appendChild(typeImg);
        master.appendChild(masterName);
        master.appendChild(masterType);
        userList.appendChild(master);
    }

    for(let user of roomInfo.users){
        const userRecord = document.createElement('div');
        userRecord.classList.add('user');
        userRecord.classList.add('regular');
        const userName = document.createElement('div');
        userName.classList.add('username');
        userName.innerHTML = user;
        
        userRecord.appendChild(userName);
        if(!roomInfo.guests.includes(user)){
            const userType = document.createElement('div');
            userType.classList.add('usertype');
            const typeImg = document.createElement('img');
            typeImg.src = '/static/icons/check-circle-fill-blue.svg';
            userType.appendChild(typeImg);
            userRecord.appendChild(userType);
        }
        userList.appendChild(userRecord);
    }
    return userList;
}

/**
 * Method to get the main test info container to display in the waiting room
 * @param {DOM} - Dom container with the test info
 */
function getTestInfoContainer(){
    const testInfoCont = document.createElement('div');
    testInfoCont.classList.add('container');
    testInfoCont.classList.add('mt-4');
    testInfoCont.classList.add('containerInfo');

    const testTitleCont = document.createElement('div');
    testTitleCont.id = 'testTitle';
    const testTitleHead = document.createElement('h3');
    testTitleHead.classList.add('text-white');
    testTitleHead.innerHTML = testTitle;
    testTitleCont.appendChild(testTitleHead);

    const testDescriptionCont = document.createElement('div');
    testDescriptionCont.id = 'testDescription';
    const testDescriptionHead = document.createElement('p');
    testDescriptionHead.classList.add('text-white');
    testDescriptionHead.innerHTML = testDescription;
    testDescriptionCont.appendChild(testDescriptionHead);

    const alertContainer = document.createElement('div');
    alertContainer.id = 'alertContainer';
    const infoAlert = document.createElement('div');
    infoAlert.classList.add('alert');
    infoAlert.classList.add('infoAlert');
    infoAlert.role = 'alert';
    const alertHeading = document.createElement('h4');
    alertHeading.classList.add('alert-heading');
    alertHeading.innerHTML = '¡En la sala de espera!';
    const alertText = document.createElement('p');
    alertText.innerHTML = 'Te encuentras en la sala de espera del cuestionario. Puedes ver justo debajo una lista de las personas conectadas a esta misma sala de espera.';
    const alertSeparator = document.createElement('hr');
    const alertSubtext = document.createElement('p');
    if(isMasterUser){
        alertSubtext.innerHTML = 'Espera a que todos los participantes se encuentren en la sala de espera y dale al botón para comenzar el cuestionario. Una vez que el cuestionario comience no se podrán unir más participantes.';
    }else{
        alertSubtext.innerHTML = '¡Relajate! Ahora solo tienes que espera a que el maestro de sala comience el cuestionario.';
    }
    alertSubtext.classList.add('mb-0');
    infoAlert.appendChild(alertHeading);
    infoAlert.appendChild(alertText);
    infoAlert.appendChild(alertSeparator);
    infoAlert.appendChild(alertSubtext);
    alertContainer.appendChild(infoAlert);

    const testStatus = document.createElement('div');
    testStatus.id = 'testStatus';
    const userPill = document.createElement('span');
    userPill.classList.add('badge');
    userPill.classList.add('rounded-pill');
    userPill.classList.add('text-bg-light');
    const userCounter = document.createElement('strong');
    userCounter.innerHTML = roomInfo.users.length;
    const userCounterLabel = document.createElement('span');
    userCounterLabel.innerHTML = ' participantes';
    userPill.appendChild(userCounter);
    userPill.appendChild(userCounterLabel);   
    testStatus.appendChild(userPill);
    if(roomInfo.master != null && roomInfo.master != ''){
        const masterPill = document.createElement('span');
        masterPill.classList.add('badge');
        masterPill.classList.add('rounded-pill');
        masterPill.classList.add('text-bg-light');
        masterPill.innerHTML = 'Maestro listo';
        testStatus.appendChild(masterPill);
    }

    testInfoCont.appendChild(testTitleCont);
    testInfoCont.appendChild(testDescriptionCont);
    testInfoCont.appendChild(alertContainer);
    testInfoCont.appendChild(testStatus);

    if(isMasterUser){
        const optionButtons = document.createElement('div');
        optionButtons.id = 'optionButtons';
        optionButtons.classList.add('mt-3');
        const startButton = document.createElement('button');
        startButton.classList.add('btn');
        startButton.classList.add('btn-primary');
        startButton.classList.add('me-2');
        startButton.innerHTML = 'Comenzar';
        if(roomInfo.users.length==0){
            startButton.disabled = true;
        }
        startButton.onclick = startTest;
        const codeButton = document.createElement('button');
        codeButton.classList.add('btn');
        codeButton.classList.add('btn-outline-info');
        codeButton.innerHTML = 'Código QR';
        codeButton.onclick = showQRModal;
        optionButtons.appendChild(startButton);
        optionButtons.appendChild(codeButton);
        testInfoCont.appendChild(optionButtons);
    }

    return testInfoCont;
}

/**
 * Events executed when the master user clicks on the start button.
 */
function startTest(){
    const startInfo = {roomId: connectionInfo.roomId}
    socket.emit(START_EVENT, startInfo);
}

/**
 * Display next question on the screen or the results table if test has ended.
 */
function showNextQuestion(){
    userAnswered = roomInfo.users.length;
    hasAnswered = false;
    if(testQuestions.length<=index){

        if(isMasterUser){
            sendEvent(END_TEST,{roomId: connectionInfo.roomId, answers: convertMapToObjectArray(answersReceived)});
        }
        showLoader()
        return -1
    }
    let targetQuestion = testQuestions[index];
    targetQuestionId = targetQuestion.id;

    hideAll();
    const mainContainer = $("#mainContainer")[0];
    
    const testInfo = document.createElement('div');
    testInfo.classList.add('container');
    testInfo.classList.add('mt-4');

    const userInfo = document.createElement('div');
    userInfo.id = 'userInfo';

    const userCounter = createUserCounterAlert();
    const questionCounter = createQuestionCounter();
    const questionContainer = createQuestionContainer(targetQuestion);
    
    testInfo.appendChild(userInfo);
    testInfo.appendChild(userCounter);
    testInfo.appendChild(questionCounter);
    testInfo.appendChild(questionContainer)

    if(isMasterUser){
        const nextButton = createElement('button', 'nextButton', '.btn.btn-primary.mt-3');
        nextButton.innerHTML = 'Siguiente';
        nextButton.onclick = endQuestion;
        testInfo.appendChild(nextButton);
    }
    
    mainContainer.appendChild(testInfo);
}

/**
 * Method to create the DOM necessary to display the question
 * @param {object} targetQuestion - the target question info
 * @returns {DOM} - Container to display the question and posible answers in radio buttons.
 */
function createQuestionContainer(targetQuestion){
    const questContainer = createElement('div', '', '.containerInfo.mt-3');
    const questTitleCont = createElement('div', 'questionTitle', '');
    const questTitle = createElement('h3', '', '.text-white');
    questTitle.innerHTML = targetQuestion.title;
    questTitleCont.appendChild(questTitle);
    questContainer.appendChild(questTitleCont);

    const answersCont = createElement('div', 'answersOptions', '.mt-4');
    for(let eachAnswer of targetQuestion.answers){
        const formCheck = createElement('div', '', '.form-check');
        const answerInput = createElement('input', eachAnswer.id, '.form-check-input.user-answer');
        answerInput.name = 'answerInput';
        answerInput.value = eachAnswer.name;
        answerInput.type = 'radio';
        answerInput.onclick = answerOnClick;
        if(isMasterUser){
            answerInput.disabled = true;
        }
        const inputLabel = createElement('label', '', '.form-check-label.text-white');
        inputLabel.setAttribute('for', eachAnswer.id);
        inputLabel.innerHTML = eachAnswer.name;
        inputLabel.onclick = answerOnClick;
        formCheck.appendChild(answerInput);
        formCheck.appendChild(inputLabel);
        answersCont.appendChild(formCheck);
    }
    questContainer.appendChild(answersCont);
    return questContainer;
}

/**
 * Method to create the DOM necessary to question counter in screen
 * @returns {DOM} - Container to display the question counter in screen.
 */
function createQuestionCounter(){
    const questionCounter = createElement('div', 'questionCounter', '');
    const pill = createElement('span', '', '.badge.rounded-pill.text-bg-primary');
    const questionCounterString = getQuestionCounter();
    pill.innerHTML = questionCounterString;
    questionCounter.appendChild(pill);
    return questionCounter;
}

/**
 * Method to get the question counter
 * @returns {string} - Question counter in format {x / x}
 */
function getQuestionCounter(){
    let str = '';
    str = index+1 + ' / ' + testQuestions.length;
    return str;
}

/**
 * Method to get the users left to answer the question alert.
 * @returns {DOM} - Alert to display in screen users left to answer the question
 */
function createUserCounterAlert(){
    const userCounter = document.createElement('div');
    userCounter.id = 'userCounter';

    const userCounterAlert = createElement('div', '', '.alert.userCounterAlert');
    userCounterAlert.role = 'alert';

    const spinner = createElement('div', '', '.spinner-border.text-warning');
    spinner.role = 'status';
    const loadingSpin = createElement('span', '', '.visually-hidden');
    loadingSpin.innerHTML = 'Loading...';
    spinner.appendChild(loadingSpin);
    const alertText = createElement('span', '', '');
    alertText.innerHTML = 'Quedan ';
    const numPers = createElement('strong', 'userCounterSpan','');
    numPers.innerHTML = userAnswered + ' personas';
    alertText.appendChild(numPers);
    alertText.innerHTML = alertText.innerHTML + ' por contestar';

    userCounterAlert.appendChild(spinner);
    userCounterAlert.appendChild(alertText);
    userCounter.appendChild(userCounterAlert);
    return userCounter;
}

/**
 * Split a string to separate a class like string to a array like
 * @param {string} str - string like class
 * @returns {array} - Array of the classes in the str like param
 */
function parseClassList(str){
    const strSplit = str.split('.');
    const classList = strSplit.filter((i)=>i!='.'&&i!='');
    return classList;
}

/**
 * Create a specific element with an id and a set of clases
 * @param {string} elementName - name of the element to create
 * @param {string} id - id of the element
 * @param {string} classes - classes in str like to add to the element
 * @returns {DOM} - Element created
 */
function createElement(elementName, id, classes){
    const classList = parseClassList(classes);
    const element = document.createElement(elementName);
    if(id!='' && id!=undefined){
        element.id = id;
    }
    for(let eachClass of classList){
        element.classList.add(eachClass);
    }
    return element;
}

/**
 * Create a specific element with an id and a set of clases
 * @param {string} elementName - name of the element to create
 * @param {string} id - id of the element
 * @param {string} classes - classes in str like to add to the element
 * @returns {DOM} - Element created
 */
function createButton(id, answer){
    let button = document.createElement('input');
    button.type = 'radio';
    button.classList.add('user-answer')
    button.id = 'answer-' + id;
    button.name = 'user-answer';
    button.value = answer;
    button.onclick = answerOnClick;

    let buttonLabel = document.createElement('label');
    buttonLabel.setAttribute('for', button.id);
    buttonLabel.innerHTML = answer;
    buttonLabel.onclick = answerOnClick;

    return [button, buttonLabel];
}

function answerOnClick(){
    if(!hasAnswered && !isMasterUser){
        const alertCont = $("#userInfo")[0];
        const waitResponseAlert = createElement('div', '', '.alert.waitResponseAlert');
        waitResponseAlert.role = 'alert';
        const spinCont = createElement('div', '', 'spinnContainer');
        const spinner = createElement('div', '', '.spinner-border.text-info');
        spinner.role = 'status';
        spinCont.appendChild(spinner);
        waitResponseAlert.appendChild(spinCont);
        const alertText = createElement('strong', '', '');
        alertText.innerHTML = 'Espera a que respondan los demás participantes.';
        waitResponseAlert.appendChild(alertText);
        alertCont.appendChild(waitResponseAlert);
       
        sendEvent(USER_ANSWERED, {roomId: connectionInfo.roomId});
    }
    hasAnswered = true;
}

// Method executed by the master to end the question
function endQuestion(){
    sendEvent(END_QUESTION, {roomId: connectionInfo.roomId, questionId: targetQuestionId});

}

function getRandomColor(){
    //CDF0EA F9F9F9 F6C6EA FAF4B7
    const colors = ['#CDF0EA', '#F9F9F9', '#F6C6EA', '#FAF4B7'];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function getRandomAnimation(){
    const animations = ['in:polygon:opposing-corners', 'in:circle:hesitate', 'in:diamond:hesitate'];
    const random = Math.floor(Math.random() * animations.length);
    return animations[random];
}

// Method to send a event to the server
function sendEvent(nameEvent, info){
    socket.emit(nameEvent, info);
}

function showResults(){
    //? Muestro resultados
    showCorrectAnswer();
    showAnswersChart();
}

function showCorrectAnswer(){
    if($("#userInfo").length>0){
        $("#userInfo")[0].innerHTML = '';
    }
    if($("#nextButton").length>0){
        $("#nextButton")[0].onclick = finishQuestion;
    }
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    $("#userCounter")[0].innerHTML = '';
    let targetQuestion = testQuestions[index];
    const correctAnswersList = correctAnswers.get(targetQuestionId);
    const correctAnwersIds = [];
    for(let ans of correctAnswersList){
        correctAnwersIds.push(ans.id);
    }
    const answersOptionsCont = $("#answersOptions")[0];
    answersOptionsCont.innerHTML = '';
    let auxIndex=0;
    for(let eachAnswer of targetQuestion.answers){
        let targetLetter = letters[auxIndex];
        const answerCont = createElement('div', '', '.mb-2.d-flex.align-items-center');
        if(correctAnwersIds.includes(eachAnswer.id)){
            let correctSVG = document.createElement('img');
            correctSVG.src = '/static/icons/check-circle-fill.svg';
            correctSVG.classList.add('me-3');
            answerCont.appendChild(correctSVG);
        }else{
            let incorrectSVG = document.createElement('img');
            incorrectSVG.src = '/static/icons/x-circle-fill.svg';
            incorrectSVG.classList.add('me-3');
            answerCont.appendChild(incorrectSVG);
        }
        const answerTitle = createElement('span','','.text-white');
        answerTitle.innerHTML = targetLetter + '. ' + eachAnswer.name;
        answerCont.appendChild(answerTitle);
        answersOptionsCont.appendChild(answerCont);
        auxIndex++;
    }
    if(!isMasterUser){
        if(correctAnwersIds.indexOf(myAnswers.get(targetQuestionId))>=0){
            const correctAlert = createElement('div', '' , '.alert.correctAlert');
            correctAlert.role = 'alert';
            const emojiSpan = createElement('span', '','');
            emojiSpan.innerHTML = '&#127881;';
            const emojiSpan2 = createElement('span', '','');
            emojiSpan2.innerHTML = '&#127881;';
            const label = createElement('span', '', '.ms-2.me-2');
            label.innerHTML = '¡CORRECTO!';
            correctAlert.appendChild(emojiSpan);
            correctAlert.appendChild(label);
            correctAlert.appendChild(emojiSpan2);
            $("#userCounter")[0].appendChild(correctAlert);
        }else{
            const incorrectAlert = createElement('div', '' , '.alert.incorrectAlert');
            incorrectAlert.role = 'alert';
            const emojiSpan = createElement('span', '','');
            emojiSpan.innerHTML = '&#128162;';
            const emojiSpan2 = createElement('span', '','');
            emojiSpan2.innerHTML = '&#128162;';
            const label = createElement('span', '', '.ms-2.me-2');
            label.innerHTML = '¡INCORRECTO!';
            incorrectAlert.appendChild(emojiSpan);
            incorrectAlert.appendChild(label);
            incorrectAlert.appendChild(emojiSpan2);
            $("#userCounter")[0].appendChild(incorrectAlert);
        }
    }
}

function showAnswersChart(){
    let questionMainContainer = $(".containerInfo")[0];
    // Show chart
    let chartContainer = document.createElement('div');
    //chartContainer.classList.add('mt-4');
    chartContainer.classList.add('chartContainer');
    let chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'resultChart';
    chartContainer.appendChild(chartCanvas);
    questionMainContainer.appendChild(chartContainer);
    createChart();
}

function createChart(){
    const ctx = document.getElementById('resultChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [{
            label: '# of Votes',
            data: getAnswersDataFromUsers(),
            borderWidth: 1
        }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Resultados',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font: {
                        size: 14,
                        weight: 'bolder'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                }
              }
        }
    });
}

function getAnswersDataFromUsers(){
    let targetQuestion = testQuestions[index];
    const answersFromQuestion = answersReceived.get(targetQuestionId);
    //const answersFromQuestion = answersReceived.filter((i) => i.questionId == targetQuestionId);
    const resp = [];
    for(let targetAnswer of targetQuestion.answers){
        let aCounter = answersFromQuestion.filter((i) => i.id == targetAnswer.id).length;
        resp.push(aCounter);
    }
    return resp;
}

function finishQuestion(){
    sendEvent(NEXT_QUESTION,connectionInfo.roomId);
    //index++;
    //hideAll();
    //showNextQuestion();
}

// Method to convert the answer map to an object array
// Socket.io does not allow send map objects
function convertMapToObjectArray(answerMap){
    const arrayMap = [];
    for (const [questionId, answerArray] of answerMap.entries()) {
        arrayMap.push({questionId: questionId, answers: answerArray});
    }
    return arrayMap;
}

function getResultTable(results){
    const resultTable = document.createElement('table'); 
    resultTable.classList.add('table');
    resultTable.classList.add('table-dark');
    resultTable.classList.add('table-hover');
    const tHead = document.createElement('thead');
    const tHeadTR = document.createElement('tr');
    const tHeadTH1 = document.createElement('th');
    tHeadTH1.scope = 'col';
    tHeadTH1.innerHTML = "#";
    const tHeadTH2 = document.createElement('th');
    tHeadTH2.scope = 'col';
    tHeadTH2.innerHTML = 'Nombre';
    const tHeadTH3 = document.createElement('th');
    tHeadTH3.scope = 'col';
    tHeadTH3.innerHTML = 'Puntuación';

    tHeadTR.appendChild(tHeadTH1);
    tHeadTR.appendChild(tHeadTH2);
    tHeadTR.appendChild(tHeadTH3);
    tHead.appendChild(tHeadTR);
    resultTable.appendChild(tHead);

    const tBody = document.createElement('tbody');
    for(let resultIndex in results){
        const result = results[resultIndex];
        resultIndex++;
        const bodyTR = document.createElement('tr');
        if(resultIndex<4){
            bodyTR.classList.add('table-info');
        }
        const indexTH = document.createElement('th');
        indexTH.scope = "row";
        indexTH.innerHTML = (resultIndex).toString();
        const nameTD = document.createElement('td');
        nameTD.innerHTML = result.user;
        const punctTD = document.createElement('td');
        punctTD.innerHTML = result.correctCounter;
        bodyTR.appendChild(indexTH);
        bodyTR.appendChild(nameTD);
        bodyTR.appendChild(punctTD);
        tBody.appendChild(bodyTR);
    }
    resultTable.appendChild(tBody);
    return resultTable;
}

function showNotification(toastType, title, text){
   const toastContainer = $(".toast-container")[0];
   const liveToast = document.createElement('div');
   liveToast.classList.add('toast');
   liveToast.role = 'alert';
   liveToast.ariaLive = 'assertive';
   liveToast.ariaAtomic = 'true';

   const toastHeader = document.createElement('div');
   toastHeader.classList.add('toast-header');

    const toastImg = document.createElement('div');
    toastImg.classList.add('rounded');
    if(toastType==TOAST_SUCCESS){
        toastImg.classList.add('toast-success-img');
    }else{
        toastImg.classList.add('toast-fail-img');
    }
   
    toastImg.classList.add('me-2');

   const toastTitle = document.createElement('strong');
   toastTitle.classList.add('me-auto')
   toastTitle.innerHTML = title;

   const toastButton = document.createElement('button');
   toastButton.classList.add('btn-close');
   toastButton.type = 'button';
   toastButton.setAttribute('data-bs-dismiss', 'toast');
   toastButton.ariaLabel = 'Close';

   toastHeader.appendChild(toastImg);
   toastHeader.appendChild(toastTitle);
   toastHeader.appendChild(toastButton);

   const toastBody = document.createElement('div');
   toastBody.classList.add('toast-body');
   toastBody.innerHTML = text;

   liveToast.appendChild(toastHeader);
   liveToast.appendChild(toastBody);

   toastContainer.appendChild(liveToast);
    //const toastTrigger = document.getElementById('liveToastBtn')
    //const toastLiveExample = document.getElementById('liveToast')

    //if (toastTrigger) {
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(liveToast)
    //toastTrigger.addEventListener('click', () => {
        toastBootstrap.show()
    //})
    //}
}

/*setInterval(() => {
    showNotification('asdf', 'asdf','fdsa');
}, 3000);*/

function showQRModal(){
    qrModal.show();
    showQRcode(connectionInfo.roomId);
}

function showQRcode(roomId){
    if(!qrCodeIsRendered){
        const qrcode = new QRCode(document.getElementById('qrcode'), {
            text: window.location.hostname + '/test/d/'+roomId,
            width: 128,
            height: 128,
            colorDark : '#000',
            colorLight : '#fff',
            correctLevel : QRCode.CorrectLevel.H
        });
        //$("#urlRoomId")[0].innerHTML = window.location.hostname + '/test/d/'+roomId;
        qrCodeIsRendered=true;
    }
    
}

function saveResults(){
    const resultsInObjectNotation = convertMapToObjectArray(answersReceived);
    axios.post('/test/saveResults', {
        responses: resultsInObjectNotation
      })
      .then(function (response) {
        if(response.data.error){
            window.location.href = "/error";
        }
        if(response.data.status){
            showNotification(TOAST_SUCCESS, 'Datos guardados', 'Las respuestas han sido guardadas correctamente.');
            $("#saveDataButton")[0].innerHTML = '¡Cambios guardados!';
            $("#saveDataButton")[0].disabled = true;
        }
      })
      .catch(function (error) {
        showNotification(TOAST_FAIL, 'Algo ha ocurrido mal', 'No se han podido guardar las respuestas.');
      });
}

