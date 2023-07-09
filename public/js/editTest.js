const DEBUG = false;
const testId = dataFromServer;
debug();

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
            if(!response.data.error){
                console.log("info recibida!");
                console.log(response.data);
                testData = response.data;
                questions = response.data.questions;
                console.log(questions)
                if(questions.length==0){
                    showNoQuestionsScreen()
                }else{
                    console.log(testData);
                    displayInitiateQuestions();
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function newQuestion(){
    let order = getLastQuestion()+1;
    let provisionalId = getLastId()+1;
    questions.push({
        id: provisionalId,
        title: '',
        correctAnswer: '',
        incorrectAnswers: [],
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
    displayQuestion(item.id)
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

        let span = document.createElement('span');
        span.classList.add('badge');
        span.classList.add('rounded-pill');
        span.classList.add('text-bg-info');
        span.innerHTML = targetQuestion[0].order;
        mainScreen.appendChild(span);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-outline-danger');
        deleteButton.id = targetQuestion[0].id +'d';
        deleteButton.innerHTML = 'Eliminar';
        deleteButton.onclick = onClickDeleteQuestion;
        mainScreen.appendChild(deleteButton);
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
            questions[i].correctAnswer = correctInputValue;
            questions[i].incorrectAnswers = [incorrect1InputValue,incorrect2InputValue,incorrect3InputValue];
            questions[i].isUpdated = questions[i].isNew ?  false : true;
            console.log("EDITADO QUESTION");
            console.log(questions[i])
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
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log("asf")
}

function getServerData(){
    axios.get('/test/getdata/' + testId)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
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
        console.log(response);
        location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
      //console.log("GUARDAR CASO DESACTIVADO")
}