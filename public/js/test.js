let testQuestions = [];
let index = 0;
let sessionPhase = true;
let roomInfo;
const CONNECT_EVENT = 'room-connection';
const myModal = new bootstrap.Modal('#staticBackdrop', {
    keyboard: false
})


//loadQuestions();
// Init bootstrap

// Init socket events
var socket = io();
socket.on('userconnect', (roomInfoS) => {
    if(sessionPhase){
        roomInfo = roomInfoS;
        showUsersTable();
        console.log(roomInfo)
        /*const userList = $("#userList")[0];
        const masterList = $("#masterList")[0]
        userList.innerHTML = '';
        masterList.innerHTML = '';
        if(roomInfo.master!=undefined){
            console.log("a")
            const masterInfo = document.createElement('li');
            masterInfo.classList.add('list-group-item');
            masterInfo.innerHTML = roomInfo.master;
            masterList.appendChild(masterInfo);
        }
        for(let user in roomInfo.users){
            const userInfo = document.createElement('li');
            userInfo.classList.add('list-group-item');
            userInfo.innerHTML = roomInfo.users[user];
            userList.appendChild(userInfo)
        }*/
    }
})
const connectionInfo = {
    roomId: dataFromServer.roomId,
    userId: dataFromServer.userId
}
init();
/*const connectionInfo = {
    roomId: dataFromServer.roomId,
    userId: dataFromServer.userId
}
socket.emit('room', connectionInfo);*/

function loadQuestions(){
    axios.get('/test/i/2')
        .then(function (response) {
            // handle success
            testQuestions = response;
            loadHandler();
        }).catch(function (error) {
            // handle error
            console.log(error);
        });
}



/*function loadHandler(){
    let question = testQuestions[index]
    let main = document.getElementsByClassName('mainContainer')[0];

    let cont = document.createElement('div');
    cont.classList = 'secondaryContainer';
    cont.style.transition = "in:circle:hesitate";
    cont.style.backgroundColor = getRandomColor();
    cont.setAttribute('transition-style',getRandomAnimation())

    // <h3 class="mb-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores, voluptatem!</h3>
    let title = document.createElement('h3');
    title.classList.add('mb-5');
    title.innerHTML = 'Test';

    // <div class="buttons">
    let buttons = document.createElement('div');
    buttons.classList.add('buttons');

    // <button type="button" class="btn btn-primary mb-3" data-bs-toggle="button">Lorem ipsum dolor sit.</button>
    let button1 = createButton('asffsdf');
    let button2 = createButton('asf asf asf');
    let button3 = createButton('asf asf asf');
    let button4 = createButton('asf asf asf');

    buttons.appendChild(button1);
    buttons.appendChild(button2);
    buttons.appendChild(button3);
    buttons.appendChild(button4);

    let but = document.createElement('button');
    but.classList.add('btn');
    but.classList.add('btn-primary')
    but.onclick = nextStep;
    but.innerHTML = 'Siguiente';

    buttons.appendChild(but);

    cont.appendChild(title);
    cont.appendChild(buttons);
    main.appendChild(cont);
    console.log("asdf")
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

function createButton(answer){
    let button = document.createElement('button');
    button.classList.add('btn');
    button.classList.add('btn-outline-primary');
    button.classList.add('mb-3');
    button.setAttribute('data-bs-toggle','button');
    button.innerHTML = answer;
    return button;
}

function nextStep(){
    console.log("asffsa")
}*/

function init(){
    hideAll();
    let username = dataFromServer.userId;
    let roomId = dataFromServer.roomId;
    if(username==null || username == ''){
        myModal.show();
    }else{
        showLoader();
        connectToRoom(connectionInfo.roomId, connectionInfo.userId, false)
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
        connectionInfo.userId = nameInput.value;
        myModal.hide();
        showLoader();
        connectToRoom(connectionInfo.roomId, connectionInfo.userId, true)
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
    /*.container.rounded.participantContainer.mt-5.p-5 
                h3 Master
                .ownerContainer 
                    ul#masterList.list-group
                        //li.list-group-item Plushy
                h3 Participantes
                .studentContainer
                    ul#userList.list-group
                        //li.list-group-item Plushy*/
    const mainContainer = $('.mainContainer')[0];
    const userContainer = document.createElement('div');
    userContainer.classList.add('container') // = ['container', 'rounded', 'participantContainer', 'mt-5', 'p-5'];
    userContainer.classList.add('rounded');
    userContainer.classList.add('participantContainer');
    userContainer.classList.add('mt-5');
    userContainer.classList.add('p-5');

    const masterTitle = document.createElement('h3');
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
    partTitle.innerHTML = 'Participantes';
    userContainer.appendChild(partTitle);
    
    const partContainer = document.createElement('div');
    partContainer.classList.add('studentContainer');

    const partList = document.createElement('ul');
    partList.id = 'userList';
    partList.classList.add('list-group');

    if(roomInfo!=undefined && roomInfo.users.length>0){
        for(let user of roomInfo.users){
            console.log("A USER!")
            const userInfo = document.createElement('li');
            userInfo.classList.add('list-group-item');
            userInfo.innerHTML=user;
            partList.appendChild(userInfo);
        }
    }
    partContainer.appendChild(partList);
    userContainer.appendChild(partContainer);

    mainContainer.appendChild(userContainer);
}