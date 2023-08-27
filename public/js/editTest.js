const DEBUG = false;
const testId = dataFromServer;
let isSaveAlertOn = false;
let orderTarget = 0;
debug();

window.addEventListener('beforeunload', (event) => {
    if(isSaveAlertOn){
        // Cancel the event to prevent the browser from navigating away immediately
        event.preventDefault();
        // Chrome requires the return value to be set for the alert message to be shown
        event.returnValue = '';

        // Display the alert message
        const confirmationMessage = '¿Estás seguro de que quieres salir? Hay datos sin guardar que podrías perder.';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    }
    
});

const question = {
    id: 12,
    title: 'Example of question title',
    answers: {
        correct: 'Respuesta correcta',
        incorrect1: 'Respuesta incorrecta',
        incorrect2: 'Respuesta incorrecta2',
        incorrect3: 'Respuesta incorrecta3'
    },
    order: 1,
    isNew: false
}

const fquestion = {
    id: 12,
    title: 'Example of question title',
    correctAnswer: 'Respuesta correcta',
    incorrectAnswers: ['Respuesta incorrecta','Respuesta incorrecta 2','Respuesta incorrecta 3'],
    order: 1,
    isNew: false,
    isDeleted: false,
    isUpdated: false
}

init();

let questions = [];
let questionTargeted;

try{
    var el = document.getElementById('questionOrder');
    var sortable = new Sortable(el, {
        animation: 800,
        onUpdate: orderUpdated
    });
}catch(error){
    console.error(error)
}

let animation = bodymovin.loadAnimation({
    container: document.getElementById('noQuestionAnimation'),
    path: '/static/lottie/noDataGhost.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})

let loadinganimation = bodymovin.loadAnimation({
    container: document.getElementById('loadingAnimation'),
    path: '/static/lottie/loading.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})

function init(){
    axios.get('/test/getdata/' + testId)
        .then(function (response) {
            if(response.data.error){
                window.location.href = "/error";
            }
            if(!response.data.error){
                testData = response.data;
                questions = response.data.questions;
                console.log(questions);
                setModalData(testData);
                if(questions.length==0){
                    showNoQuestionsScreen()
                }else{
                    displayInitiateQuestions();
                }
            }
        })
        .catch(function (error) {
            window.location.href = "/error";
        });
}

function setModalData(testData){
    const titleInput = $("#testTitleInput")[0];
    const descriptionInput = $("#testDescriptionInput")[0];
    $("#isActiveTestCheckbox")[0].checked = testData.active;
    const interactiveCodeInput = $("#interactiveCodeInput")[0];
    titleInput.value = testData.title;
    descriptionInput.value = testData.description;
    interactiveCodeInput.value = testData.interactiveCode;
}

function testTitleOnChange(){
    testData.title = $("#testTitleInput")[0].value;
}

function testDescriptionOnChange(){
    testData.description = $("#testDescriptionInput")[0].value;
}

function testActiveOnChange(){
    console.log("active edited! " + $("#isActiveTestCheckbox")[0].checked)
    testData.active = $("#isActiveTestCheckbox")[0].checked;
}

function newQuestion(){
    let order = getLastQuestion()+1;
    let provisionalId = getLastId()+1;
    questions.push({
        id: provisionalId,
        title: '',
        correctAnswer: {name:''},
        incorrectAnswers: [{name: ''},{name: ''},{name: ''}],
        order: order,
        isNew: true,
        isDeleted: false
    })
    // Nuevo cubo
    let cube = document.createElement('div');
    cube.classList.add('cube');

    let cubeId = provisionalId;
    cube.id = cubeId;
    cube.innerHTML = questions.length;
    cube.onclick = cubeSelection;

    let questOrder = $('#questionOrder')[0];
    questOrder.appendChild(cube)
    targetQuestion = provisionalId;
    displayQuestion(provisionalId);
    console.log("preguntas: " + JSON.stringify(questions))
    showUpdateNotification();
    showNotification('Nueva pregunta', 'Se ha creado una nueva pregunta')
}

function cleanMainScreen(){
    const mainScreen = $('#questionInfoContainer')[0];
    mainScreen.innerHTML = '';
}

function cleanQuestionOrder(){
    const questionOrderContainer = $('#questionOrder')[0];
    questionOrderContainer.innerHTML = '';
}

function showNoQuestionsScreen(){
    cleanMainScreen();
    const mainScreen = $('#questionInfoContainer')[0];
    let animContainer = document.createElement('div');
    animContainer.id = 'animationContainer';
    let animation = document.createElement('div');
    animation.id='noQuestionAnimation'
    animContainer.appendChild(animation);
    let noQuestionTitle = document.createElement('h3');
    noQuestionTitle.classList.add('text-white','mb-3');
    noQuestionTitle.innerHTML = '¡No hay ninguna pregunta!';
    let noQuestionButton = document.createElement('button');
    noQuestionButton.classList.add('btn','btn-primary');
    noQuestionButton.onclick=newQuestion;
    noQuestionButton.innerHTML+='Nueva pregunta';
    animContainer.appendChild(noQuestionTitle)
    animContainer.appendChild(noQuestionButton)
    mainScreen.appendChild(animContainer);

    let animationLottie = bodymovin.loadAnimation({
        container: document.getElementById('noQuestionAnimation'),
        path: '/static/lottie/noDataGhost.json',
        render: 'svg',
        loop: true,
        autoplay: true,
        name: 'animation name'
    })
}

function orderUpdated(evt){
    let item = evt.item;
    let from = evt.oldIndex +1;
    let to = evt.newIndex +1;
    console.log({item: item.id, from: from, to: to});
    updateArrayOrder(from, to);
    updateUpdatedItem(item, to);
    console.log(questions)
    updateScreenOrder();
    displayQuestion(item.id);
    showUpdateNotification();
}

function getLastQuestion(){
    let higher = 0;
    for(let i=0;i<questions.length;i++){
        if(questions[i].order>higher){
            higher=questions[i].order;
        }
    }
    return higher;
}

function getLastId(){
    let higher = 0;
    for(let i=0;i<questions.length;i++){
        if(questions[i].id>higher){
            higher=questions[i].id;
        }
    }
    return higher;
}

function updateArrayOrder(from, to){
    if(from<to){
        for(let i=0; i<questions.length; i++){
            if(questions[i].order<=to && questions[i].order>from){
                questions[i].order--;
                questions[i].isUpdated = true;
            }
        }
    }else{
        for(let i=0; i<questions.length; i++){
            if(questions[i].order>=to && questions[i].order<from){
                questions[i].order++;
                questions[i].isUpdated = true;
            }
        }
    }
}

function updateScreenOrder(){
    let cubes = $('.cube');
    
    for(let i=0; i<cubes.length; i++){
        //let testId = parseInt(cubes[i].id.split('o')[0]);
        let testId = parseInt(cubes[i].id);
        console.log("testiD " + testId)
        let targetTest = questions.filter((i) => i.id == testId);
        console.log("targetTest " + targetTest);
        if(targetTest.length == 1){
            console.log("order screen " + targetTest.order)
            cubes[i].innerHTML = targetTest[0].order;
        }
    }
}

function displayInitiateQuestions(){
    cleanMainScreen();
    cleanQuestionOrder();
    questions.sort((a, b) => {
        return a.order - b.order;
    });
    console.log("ORDENADO POR ORDEN");
    console.log(questions);
    if(questions.length==0 || questions.filter((i) => !i.isDeleted).length==0){
        showNoQuestionsScreen();
    }
    
    //if(questions.length>0){
    for(let quest of questions){
        if(!quest.isDeleted){
            displayQuestion(quest.id)
            break;
        }
    }
    //}
    
    for(let i=0; i<questions.length; i++){
        if(!questions[i].isDeleted){
            // Nuevo cubo
            let cube = document.createElement('div');
            cube.classList.add('cube');

            let cubeId = questions[i].id;
            cube.id = cubeId;
            cube.innerHTML = questions[i].order;
            cube.onclick = cubeSelection;

            let questOrder = $('#questionOrder')[0];
            questOrder.appendChild(cube)
        }
    }
}

function updateUpdatedItem(item, to){
    let itemId = item.id;
    itemId = parseInt(itemId.split('o')[0]);
    for(let i=0;i<questions.length; i++){
        if(questions[i].id == itemId){
            questions[i].order = to;
            questions[i].isUpdated = true;
        }
    }
}

function displayQuestion(questionId){
    const mainScreen = $('#questionInfoContainer')[0];
    cleanMainScreen();
    let targetQuestion = questions.filter((i) => i.id==questionId);
    if(targetQuestion.length==1){
        orderTarget = parseInt(targetQuestion[0].order);
        console.log("QUESTION");
        console.log(targetQuestion[0])
        questionTargeted = targetQuestion[0].id;
        let questionInput = getInput('questionInput','Pregunta', targetQuestion[0].title);
        mainScreen.appendChild(questionInput);

        let correctInput = getInput('correctInput','Respuesta correcta', targetQuestion[0].correctAnswer ? targetQuestion[0].correctAnswer.name : '');
        correctInput.classList.add('correctInput');
        mainScreen.appendChild(correctInput);
        //let inc = getIncorrectQuestions(targetQuestion[0].incorrectAnswers);
        let incorrectInput = getInput('incorrect1Input','Respuesta incorrecta 1', targetQuestion[0].incorrectAnswers.length==3 ? targetQuestion[0].incorrectAnswers[0].name : '');
        incorrectInput.classList.add('incorrectInput');
        mainScreen.appendChild(incorrectInput);

        let incorrectInput2 = getInput('incorrect2Input','Respuesta incorrecta 2', targetQuestion[0].incorrectAnswers.length==3 ? targetQuestion[0].incorrectAnswers[1].name : '');
        incorrectInput2.classList.add('incorrectInput');
        mainScreen.appendChild(incorrectInput2);

        let incorrectInput3 = getInput('incorrect3Input','Respuesta incorrecta 3', targetQuestion[0].incorrectAnswers.length==3 ? targetQuestion[0].incorrectAnswers[2].name : '');
        incorrectInput3.classList.add('incorrectInput');
        mainScreen.appendChild(incorrectInput3);

        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex');
        buttonContainer.classList.add('flex-column-reverse');
        buttonContainer.classList.add('flex-md-row')

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-outline-danger');
        deleteButton.classList.add('mt-3');
        deleteButton.id = targetQuestion[0].id +'d';
        deleteButton.innerHTML = 'Eliminar';
        deleteButton.onclick = onClickDeleteQuestion;

        let btnGroup = document.createElement('div');
        btnGroup.classList.add('btn-group');
        btnGroup.classList.add('paginationBtn')
        btnGroup.classList.add('mt-3')
        btnGroup.role = 'group';

        let previousButton = document.createElement('button');
        previousButton.classList.add('btn');
        previousButton.classList.add('btn-primary');
        previousButton.id = 'previousButton';
        if(!searchQuestionByOrder(orderTarget-1)){
            previousButton.classList.add('d-none')
        }
        previousButton.onclick = displayPreviousQuestion;

        let preImg = document.createElement('img');
        preImg.src = '/static/icons/chevron-double-left.svg';
        previousButton.appendChild(preImg);

        let orderButton = document.createElement('button');
        orderButton.classList.add('btn');
        orderButton.classList.add('btn-outline-primary');
        orderButton.innerHTML = targetQuestion[0].order;

        let nextButton = document.createElement('button');
        nextButton.classList.add('btn');
        nextButton.classList.add('btn-primary');
        nextButton.id = 'nextButton';
        nextButton.onclick = displayNextQuestion;
        
        let nextImg = document.createElement('img');
        nextImg.src = '/static/icons/chevron-double-right.svg';
        nextButton.appendChild(nextImg);

        btnGroup.appendChild(previousButton);
        btnGroup.appendChild(orderButton);
        btnGroup.appendChild(nextButton);

        buttonContainer.appendChild(deleteButton);
        mainScreen.appendChild(buttonContainer);
        buttonContainer.appendChild(btnGroup);

    }
}

const displayNextQuestion = () => {
    let nextOrder = orderTarget + 1;
    let nextQuestion = searchQuestionByOrder(nextOrder);
    if(nextQuestion){
        displayQuestion(nextQuestion)
    }else{
        newQuestion();
    }
}

const displayPreviousQuestion = () => {
    let previousOrder = orderTarget - 1;
    let previousQuestion = searchQuestionByOrder(previousOrder);
    if(previousQuestion){
        displayQuestion(previousQuestion)
    }
}

const showNotification = (title='', text='') => {
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
    toastImg.classList.add('toast-success-img');
   
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
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(liveToast)
    toastBootstrap.show()
}

const searchQuestionByOrder = (order) => {
    let targetQuestion = questions.filter((i) => i.order==order);
    if(targetQuestion.length==0){
        return null;
    }else{
        return targetQuestion[0].id;
    }
}

function onClickDeleteQuestion(){
    let qToOrder;
    const questionToDelete = this.id.split('d')[0];
    console.log("A BORRAR " + questionToDelete);
    for(let i=0; i<questions.length; i++){
        if(questions[i].id == questionToDelete){
            questions[i].isDeleted = true;
            qToOrder = questions[i].order;
        }
    }
    // UPdated order of questions
    for(let quest of questions){
        if(quest.order > qToOrder){
            quest.order = quest.order - 1;
            quest.isUpdated = true;
        }
    }
    displayInitiateQuestions();
    showUpdateNotification();
    showNotification('Pregunta eliminada', 'Se ha eliminado una pregunta.')
}

function getInput(id, title, value){
    let questionContainer = document.createElement('div');
    questionContainer.classList.add('inputbox');
    questionContainer.classList.add('mb-3');
    // Question input
    let questionInput = document.createElement('input');
    questionInput.type = 'text';
    questionInput.value = value;
    questionInput.id = id;
    questionInput.maxLength = '200';
    //questionInput.onchange = questionUpdated;
    questionInput.oninput = questionUpdated;
    let questionSpan = document.createElement('span');
    questionSpan.innerHTML = title;
    let questionI = document.createElement('i');
    questionContainer.appendChild(questionInput);
    questionContainer.appendChild(questionSpan);
    questionContainer.appendChild(questionI);

    return questionContainer;
}

function questionUpdated(){
    const questionInputValue = $("#questionInput")[0].value;
    const correctInputValue = $("#correctInput")[0].value;
    const incorrect1InputValue = $("#incorrect1Input")[0].value;
    const incorrect2InputValue = $("#incorrect2Input")[0].value;
    const incorrect3InputValue = $("#incorrect3Input")[0].value;
    //console.log({questionInputValue,correctInputValue,incorrect1InputValue,incorrect2InputValue,incorrect3InputValue})
    for(let i=0; i<questions.length; i++){
        if(questions[i].id == questionTargeted){
            questions[i].title = questionInputValue;
            // objeto {id, name}
            questions[i].correctAnswer.name = correctInputValue;
            // array de objetos {id, name}
            questions[i].incorrectAnswers[0].name = incorrect1InputValue;
            questions[i].incorrectAnswers[1].name = incorrect2InputValue;
            questions[i].incorrectAnswers[2].name = incorrect3InputValue;
            //questions[i].incorrectAnswers = [questions[i].incorrectAnswers[0],incorrect2InputValue,incorrect3InputValue];
            //questions[i].incorrectAnswers = [incorrect1InputValue,incorrect2InputValue,incorrect3InputValue];
            questions[i].isUpdated = questions[i].isNew ?  false : true;
            console.log("EDITADO QUESTION");
            console.log(questions[i])
            showUpdateNotification();
        }
    }
}



function debugInfo(){
    console.log(questions)
}

function getIncorrectQuestions(incorrect){
    const resp = ['','','']
    for(let i=0; i<incorrect.length; i++){
        resp[i] = incorrect[i];
    }
    return resp;
}

function cubeSelection(){
    console.log(this.id);
    displayQuestion(this.id);
}

function handleUpdate(){
    axios.post('/test/edit/', {
        testConfig: {},
        questions: questions
      })
      .then(function (response) {
        if(response.data.error){
            window.location.href = "/error";
        }
        console.log(response);
      })
      .catch(function (error) {
        window.location.href = "/error";
      });
    console.log("asf")
}

function getServerData(){
    axios.get('/test/getdata/' + testId)
      .then(function (response) {
        if(response.data.error){
            window.location.href = "/error";
        }
        console.log(response);
      })
      .catch(function (error) {
        window.location.href = "/error";
      });
}

function debug(){
    if(DEBUG){
        setInterval(getServerData, 7000)
        setInterval(debugInfo,5000);
    }
}

function saveDataServer(){
    testData.questions = questions;
    axios.post('/test/savedata/' + testId, {
        data: testData
      })
      .then(function (response) {
        isSaveAlertOn = false;
        if(response.data.error){
            window.location.href = "/error";
        }
        console.log(response);
        location.reload();
      })
      .catch(function (error) {
        window.location.href = "/error";
      });
      //console.log("GUARDAR CASO DESACTIVADO")
}

function showUpdateNotification(){
    if(!isSaveAlertOn){
        const mainScreen = $('#alertContainer')[0];
        let alertDiv = document.createElement('div');
        alertDiv.classList.add('alert');
        alertDiv.classList.add('alert-warning');
        alertDiv.classList.add('d-flex');
        alertDiv.classList.add('align-items-center');
        hasAnswered = false;
        let alertImg = document.createElement('img');
        alertImg.src = '/static/icons/exclamation-circle-fill.svg';
        alertImg.classList.add('me-3');
        alertDiv.appendChild(alertImg);

        let alertContent = document.createElement('div');
        let span1 = document.createElement('span');
        span1.innerHTML = '¡No olvides ';// guardar el test cuando hayas terminado!';

        let saveLink = document.createElement('a');
        saveLink.classList.add('link-info');
        saveLink.href = '#';
        saveLink.onclick = saveDataServer;
        saveLink.innerHTML = 'guardar el test ';

        let span2 = document.createElement('span');
        span2.innerHTML = ' cuando hayas terminado!';

        alertContent.appendChild(span1);
        alertContent.appendChild(saveLink);
        alertContent.appendChild(span2);

        alertDiv.appendChild(alertContent);
        
        mainScreen.appendChild(alertDiv);
        isSaveAlertOn = true;
    }
    
}

function deleteTest(){
    console.log("borrar test " + testId);
    axios.delete('/test/' + testId)
        .then(function (response) {
            if(response.data.error){
                window.location.href = "/error";
            }
            if(response.data.status){
                window.location.href = '/home';
            }
        })
        .catch(function (error) {
            window.location.href = "/error";
        });
}