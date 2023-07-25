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
const myModal = new bootstrap.Modal('#staticBackdrop', {
    keyboard: false
})
const qrModal = new bootstrap.Modal('#qrCodeModal')


//loadQuestions();
// Init bootstrap

// Init socket events
var socket = io();
socket.on(RECEIVECONNECTION_EVENT, (roomInfoS) => {
    if(sessionPhase){
        roomInfo = roomInfoS.roomInfo;
        const targetUser = roomInfoS.userTarget;
        if(targetUser.isNew){
            showNotification(TOAST_SUCCESS, 'Usuario conectado', targetUser.name + ' se ha conectado');
        }else{
            showNotification(TOAST_FAIL, 'Usuario desconectado', targetUser.name + ' se ha desconectado');
        }
        showUsersTable();
    }
})

socket.on(USER_ANSWERED, ()=>{
    let userCounterSpan = $("#masterUserCounter");
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

socket.on(START_EVENT, (testInfo) => {
    testInfo = testInfo;
    testQuestions = testInfo.questions;
    testQuestions.sort(sortByOrder);
    sessionPhase=false;
    hideAll();
    showNextQuestion();
})

socket.on(END_TEST, (results) => {
    hideAll();
    const mainContainer = $('.mainContainer')[0];
    const userContainer = document.createElement('div');
    userContainer.classList.add('container');
    userContainer.classList.add('rounded');
    userContainer.classList.add('participantContainer');
    userContainer.classList.add('mt-5');
    userContainer.classList.add('p-5');

    results.sort(sortByCorrectQuestions);
    results.reverse();

    const partContainer = document.createElement('div');
    partContainer.classList.add('studentContainer');
    const title = document.createElement('h3');
    title.innerHTML = 'Resultados';
    title.classList.add('text-center');
    title.classList.add('mainTitle')

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

socket.on(SEND_ANSWER, (answers) => {
    answersReceived.set(targetQuestionId, answers.userAnswers);
    correctAnswers.set(targetQuestionId, answers.correct);
    showResults();
})

socket.on(NEXT_QUESTION, (info) => {
    index++;
    hideAll();
    showNextQuestion();
})

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
                    id: parseInt(input.id.split('-')[1]),
                    name: input.value,
                    questionId: targetQuestionId,
                    user: connectionInfo.username,
                    userId: dataFromServer.userId,
                    isGuestUser: !dataFromServer.isAuthenticatedUser,
                    testId: dataFromServer.testId
                }
                selectedAnswerId = parseInt(input.id.split('-')[1]);
            }
            console.log({name: input.name, checked: input.checked, id: input.id});
        }
        if(selectedAnswer.selectedAnswer==null){
            selectedAnswer.selectedAnswer = {
                isNull: true,
                questionId: targetQuestionId,
                user: connectionInfo.username,
                userId: dataFromServer.userId,
                isGuestUser: !dataFromServer.isAuthenticatedUser
            }
        }
        myAnswers.set(targetQuestionId, selectedAnswerId);
        selectedAnswer.userId = connectionInfo.username;
        selectedAnswer.roomId = connectionInfo.roomId;
        sendEvent(SEND_ANSWER, selectedAnswer);
    }
})

// custom compare method by order attribute
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

// custom compare method by order attribute
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


function init(){
    hideAll();
    console.log(dataFromServer)
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

function connectToRoom(roomId, username, isGuestUser){
    const connectionInfo = {
        roomId: roomId,
        username: username,
        isGuestUser: isGuestUser
    }
    socket.emit(CONNECT_EVENT, connectionInfo);
}

function hideAll(){
    const mainContainer = $('.mainContainer')[0];
    mainContainer.innerHTML = '';
}

function setGuestUser(){
    const nameInput = $('#guestNameInput')[0];
    if(nameInput.value!=''){
        connectionInfo.username = nameInput.value;
        myModal.hide();
        showLoader();
        connectToRoom(connectionInfo.roomId, connectionInfo.username, true)
    }
}

function showLoader(){
    hideAll();
    // General container
    const mainContainer = $('.mainContainer')[0];
    // Loader container
    const loaderContainer = document.createElement('div');
    loaderContainer.classList.add('loaderContainer');
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

function showUsersTable(){
    hideAll();
    
    const mainContainer = $('.mainContainer')[0];
    const userContainer = document.createElement('div');
    userContainer.classList.add('container'); // = ['container', 'rounded', 'participantContainer', 'mt-5', 'p-5'];
    userContainer.classList.add('rounded');
    userContainer.classList.add('participantContainer');
    userContainer.classList.add('mt-5');
    userContainer.classList.add('p-5');

    const masterTitle = document.createElement('h3');
    masterTitle.classList.add('mainTitle');
    masterTitle.innerHTML = 'Master';
    userContainer.appendChild(masterTitle);

    const masterContainer = document.createElement('div');
    masterContainer.classList.add('ownerContainer');
    
    const masterList = document.createElement('ul');
    masterList.id = 'masterList';
    masterList.classList.add('list-group');

    if(roomInfo.master!=undefined && roomInfo.master!=''){
        const masterRecord = document.createElement('li');
        masterRecord.classList.add('list-group-item');
        masterRecord.innerHTML = roomInfo.master;
        masterList.appendChild(masterRecord);
    }

    masterContainer.appendChild(masterList);
    userContainer.appendChild(masterContainer);

    const partTitle = document.createElement('h3');
    partTitle.classList.add('mt-3');
    partTitle.classList.add('mainTitle');
    partTitle.innerHTML = 'Participantes';

    const userCounterSpan = document.createElement('span');
    userCounterSpan.classList.add('badge');
    userCounterSpan.classList.add('rounded-pill');
    userCounterSpan.classList.add('text-bg-primary');
    userCounterSpan.classList.add('ms-3');
    userCounterSpan.innerHTML = roomInfo.users.length;
    partTitle.appendChild(userCounterSpan);

    userContainer.appendChild(partTitle);
    
    const partContainer = document.createElement('div');
    partContainer.classList.add('studentContainer');

    const partList = document.createElement('ul');
    partList.id = 'userList';
    partList.classList.add('list-group');

    if(roomInfo!=undefined && roomInfo.users.length>0){
        for(let user of roomInfo.users){
            const userInfo = document.createElement('li');
            userInfo.classList.add('list-group-item');
            userInfo.innerHTML=user;
            partList.appendChild(userInfo);
        }
    }
    partContainer.appendChild(partList);
    userContainer.appendChild(partContainer);

    mainContainer.appendChild(userContainer);
    if(isMasterUser){
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex');
        buttonContainer.classList.add('container');
        buttonContainer.classList.add('justify-content-center');
        buttonContainer.classList.add('mt-2');
        
        const button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-lg');
        button.classList.add('btn-primary');
        button.classList.add('me-3');
        button.innerHTML = 'Comenzar';
        if(roomInfo==undefined || roomInfo.users.length==0){
            button.disabled = true;
        }
        button.onclick = startTest;

        const buttonQR = document.createElement('button');
        buttonQR.classList.add('btn');
        buttonQR.classList.add('btn-lg');
        buttonQR.classList.add('btn-outline-primary');
        buttonQR.innerHTML = 'QR';
        buttonQR.onclick = showQRModal;

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(buttonQR);

        mainContainer.appendChild(buttonContainer);
    }
    
}

function startTest(){
    console.log("start!!");
    const startInfo = {roomId: connectionInfo.roomId}
    socket.emit(START_EVENT, startInfo);
}

function showNextQuestion(){
    if(testQuestions.length<=index){

        if(isMasterUser){
            console.log("ENVIO RESULTADOS DE TESTS");
            console.log(answersReceived);
            sendEvent(END_TEST,{roomId: connectionInfo.roomId, answers: convertMapToObjectArray(answersReceived)});
        }
        showLoader()
        
        return -1
    }
    let targetQuestion = testQuestions[index];
    targetQuestionId = targetQuestion.id;
    console.log(targetQuestion);
    let main = document.getElementsByClassName('mainContainer')[0];

    let cont = document.createElement('div');
    cont.classList = 'secondaryContainer';
    cont.style.transition = "in:circle:hesitate";
    cont.style.backgroundColor = getRandomColor();
    cont.setAttribute('transition-style',getRandomAnimation())

    let questionMainContainer = document.createElement('div');
    questionMainContainer.classList.add('questionMainContainer');
 
    let alertDiv = document.createElement('div');
    alertDiv.classList.add('alert');
    alertDiv.classList.add('alert-primary');
    alertDiv.classList.add('d-flex');
    alertDiv.classList.add('align-items-center');
    hasAnswered = false;
    let alertImg = document.createElement('img');
    alertImg.src = '/static/icons/info-circle-fill.svg';
    alertImg.classList.add('me-3');
    alertDiv.appendChild(alertImg);

    let alertContent = document.createElement('div');
    let span1 = document.createElement('span');
    span1.innerHTML = 'Quedan ';
    alertContent.appendChild(span1);
    let span2 = document.createElement('span');
    userAnswered = roomInfo.users.length
    span2.innerHTML = userAnswered + ' usuarios'
    span2.id = 'masterUserCounter';
    alertContent.appendChild(span2);
    let span3 = document.createElement('span');
    span3.innerHTML = ' por responder.';
    alertContent.appendChild(span3);
    

    alertDiv.appendChild(alertContent);
    if(isMasterUser){
        questionMainContainer.appendChild(alertDiv);
    }
   

    // <h3 class="mb-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, voluptatem!</h3>
    let title = document.createElement('h3');
    title.classList.add('mb-5');
    title.innerHTML = targetQuestion.title;

    // <div class="buttons">
    let buttons = document.createElement('div');
    buttons.classList.add('buttonsContainer');

    // <button type="button" class="btn btn-primary mb-3" data-bs-toggle="button">Lorem ipsum dolor sit.</button>
    for(let targetAnswer of targetQuestion.answers){
        let btt = document.createElement('div');
        btt.classList.add('selectionButton');
        btt.classList.add('d-flex');
        let button = createButton(targetAnswer.id, targetAnswer.name);
        if(isMasterUser){
            button[0].disabled = true;
        }
        btt.appendChild(button[0]);
        btt.appendChild(button[1]);
        buttons.appendChild(btt);
    }

    if(isMasterUser){
        let but = document.createElement('button');
        but.classList.add('btn');
        but.classList.add('btn-primary')
        but.classList.add('mt-3');
        but.onclick = endQuestion;
        but.innerHTML = 'Siguiente';

        buttons.appendChild(but);
    }
    
    questionMainContainer.appendChild(title);
    questionMainContainer.appendChild(buttons);
    cont.appendChild(questionMainContainer);
    main.appendChild(cont);
    console.log("asdf")
}

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
        console.log("He respondido!")
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
    let questionMainContainer = $('.questionMainContainer')[0];
    
    // container.insertBefore(newFreeformLabel, container.firstChild);
    let selectionButtons = $('.buttonsContainer')[0];
    selectionButtons.innerHTML = '';
    let correctAnswersAux = correctAnswers.get(targetQuestionId);
    let correctAnswersIds = [];
    for(let cor of correctAnswersAux){
        correctAnswersIds.push(cor.id);
    }
    let targetQuestion = testQuestions[index];
    if(correctAnswersIds.indexOf(myAnswers.get(targetQuestionId))>=0){
        let correctTitle = document.createElement('h2');
        correctTitle.innerHTML = 'CORRECTO';
        questionMainContainer.insertBefore(correctTitle, questionMainContainer.firstChild);
    }else{
        let incorrectTitle = document.createElement('h2');
        incorrectTitle.innerHTML = 'INCORRECTO';
        questionMainContainer.insertBefore(incorrectTitle, questionMainContainer.firstChild);
    }
    let auxIndex=0;
    for(let targetAnswer of targetQuestion.answers){ //id name
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        const actualLetter = letters[auxIndex];
        auxIndex++;
        // Icons
        let correctSVG = document.createElement('img');
        correctSVG.src = '/static/icons/check-circle-fill.svg';
        correctSVG.classList.add('me-3');
        let incorrectSVG = document.createElement('img');
        incorrectSVG.src = '/static/icons/x-circle-fill.svg';
        incorrectSVG.classList.add('me-3');
        console.log('respuesta ' + targetAnswer.id)
        let displayAnswerDiv = document.createElement('div');
        displayAnswerDiv.classList.add('d-flex');
        displayAnswerDiv.classList.add('align-items-center');
        if(correctAnswersIds.indexOf(targetAnswer.id) >= 0){
            displayAnswerDiv.appendChild(correctSVG);
        }else{
            displayAnswerDiv.appendChild(incorrectSVG);
        }
        let display = document.createElement('span');
        display.innerHTML = actualLetter + '. ' + targetAnswer.name;
        displayAnswerDiv.appendChild(display)
        selectionButtons.appendChild(displayAnswerDiv);

        console.log(targetAnswer);
    }

    // Show chart
    let chartContainer = document.createElement('div');
    //chartContainer.classList.add('mt-4');
    chartContainer.classList.add('chartContainer');
    let chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'resultChart';
    chartContainer.appendChild(chartCanvas);
    questionMainContainer.appendChild(chartContainer);
    createChart();
    console.log(correctAnswersAux)

    if(isMasterUser){
        let buttonMaster = document.createElement('button');
        buttonMaster.classList.add('btn');
        buttonMaster.classList.add('btn-primary');
        buttonMaster.innerHTML = 'Siguiente';
        buttonMaster.onclick = finishQuestion;
        questionMainContainer.appendChild(buttonMaster);
    }
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
    console.log("asdfasdfasdfas");
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
   console.log('asdfasdf');
   console.log(toastContainer)
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
    console.log("GUARDAR RESULTADOS");
    console.log(answersReceived);
    const resultsInObjectNotation = convertMapToObjectArray(answersReceived);
    axios.post('/test/saveResults', {
        responses: resultsInObjectNotation
      })
      .then(function (response) {
        if(response.data.status){
            showNotification(TOAST_SUCCESS, 'Datos guardados', 'Las respuestas han sido guardadas correctamente.');
            $("#saveDataButton")[0].disabled = true;
        }
        console.log(response);
      })
      .catch(function (error) {
        showNotification(TOAST_FAIL, 'Algo ha ocurrido mal', 'No se han podido guardar las respuestas.');
        console.log(error);
      });
}

