const sockets = {};
const { Server } = require("socket.io");
const testSelector = require("./testSelector");
const userSelector = require("./userSelector");
const testController = require("./testController");
const RoomData = require("./roomsDataHandler");

// Event types
const END_QUESTION = 'end-question';
const EMPTY = {};
const SEND_ANSWER = 'send-answer';
const NEXT_QUESTION = 'next-question';
const END_TEST = 'end-test';
const USER_ANSWERED = 'user-answered';
const USER_ALREADY_EXISTS = 'user-exists';
const TEST_HAS_STARTED = 'test-started';
/*
const room = {
    roomId: 'XXXXX',
    master: userId(usernames),
    users: [userId, userId, userId]
}
*/
const rooms = new Map();
const userMap = new Map();
const testMap = new Map();

sockets.initialice = async (server) => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        // Remove user from local database
        socket.on('disconnecting',async () => {
            if(userMap.has(socket.id)){
                const userInfo = userMap.get(socket.id);
                userMap.delete(socket.id);
                if(removeUser(userInfo.username, userInfo.roomId)){
                    io.to(userInfo.roomId).emit('userconnect',{roomInfo: rooms.get(userInfo.roomId), userTarget: {isNew: false, name: userInfo.username}});
                }
            }
        })

        // Conect a user to a room
        socket.on('room-connection', async (connectionInfo) => {
            // Validate connectionInfo.username not exists in roomInfo map
            if(await userAlreadyExists(connectionInfo.roomId, connectionInfo.username, connectionInfo.isGuestUser)){
                socket.emit(USER_ALREADY_EXISTS,EMPTY);
            }else if(hasTestStarted(connectionInfo.roomId)){
                socket.emit(TEST_HAS_STARTED,EMPTY);
            }
            else{
                userMap.set(socket.id, {username: connectionInfo.username, roomId: connectionInfo.roomId, isGuest: connectionInfo.isGuestUser})
                const test = await testSelector.checkInteractiveCode(connectionInfo.roomId);
                if(connectionInfo.isGuestUser){
                    addUser(test[0].id, connectionInfo.username, connectionInfo.roomId, false, true)
                }else{
                    const user = await userSelector.getUser(connectionInfo.username, connectionInfo.username);
                    //const test = await testSelector.checkInteractiveCode(connectionInfo.roomId);
                    console.log(user);
                    console.log(test)
                    if(user!=null && test!=null && user.length>0 && test[0].userId==user[0].id){
                        console.log('usuario identificado y master')
                        addUser(test[0].id, connectionInfo.username, connectionInfo.roomId, true, false);
                    }else{
                        console.log('usuario identificado y no master')
                        addUser(test[0].id, connectionInfo.username, connectionInfo.roomId, false, false);
                    }
                }
                socket.join(connectionInfo.roomId)
                io.to(connectionInfo.roomId).emit('userconnect',{roomInfo: rooms.get(connectionInfo.roomId), userTarget: {isNew: true, name: connectionInfo.username}});
            }
        })

        socket.on(USER_ANSWERED, async(roomInfo) => {
            sendEvent(io, roomInfo.roomId, USER_ANSWERED, EMPTY);
        })

        // Evento recibido del master de cada test interactivo
        socket.on(END_QUESTION, async(roomInfo) => {
            console.log('Finalizar pregunta ' + roomInfo.roomId)
            //const correctAnswer = await testController.getCorrectAnswer(roomInfo.questionId);
            sendEvent(io, roomInfo.roomId, END_QUESTION ,EMPTY);
        })

        socket.on('start-test', async (startInfo) => {
            if(startInfo.roomId){
                let testInfo;
                const test = await testSelector.checkInteractiveCode(startInfo.roomId);
                if(test.length > 0){
                    testInfo = await testController.getFullTestInfoAnon(test[0].id);
                    rooms.get(startInfo.roomId).started = true;
                    io.to(startInfo.roomId).emit('start-test', testInfo);
                }
            }
        })

        socket.on(SEND_ANSWER, async (answersInfo) => {
            console.log('HE RECIBIDO UNA RESPUESTA POR UN USUARIO ');
            console.log(answersInfo);
            //const key = answersInfo.question.id + '-' + answersInfo.roomId;
            if(testMap.has(answersInfo.roomId)){
                const questionsMap = testMap.get(answersInfo.roomId); //.push(answersInfo.selectedAnswer);
                if(questionsMap.has(answersInfo.selectedAnswer.questionId)){
                    questionsMap.get(answersInfo.selectedAnswer.questionId).push(answersInfo.selectedAnswer);
                }else{
                    questionsMap.set(answersInfo.selectedAnswer.questionId, [answersInfo.selectedAnswer]);
                }
            }else{
                testMap.set(answersInfo.roomId, new Map([[answersInfo.selectedAnswer.questionId, [answersInfo.selectedAnswer]]]));
            }
            console.log(testMap)
            if(testMap.get(answersInfo.roomId).get(answersInfo.selectedAnswer.questionId).length >= rooms.get(answersInfo.roomId).users.length){
                console.log("YA HE RECIBIDO DE TODOS LOS USUARIOS OS ENVIO ESTO");
                const correctAnswer = await testController.getCorrectAnswer(answersInfo.selectedAnswer.questionId);
                console.log({correct: correctAnswer, userAnswers: testMap.get(answersInfo.roomId).get(answersInfo.selectedAnswer.questionId)});
                sendEvent(io, answersInfo.roomId, SEND_ANSWER, {correct: correctAnswer, userAnswers: testMap.get(answersInfo.roomId).get(answersInfo.selectedAnswer.questionId)});
            }
        });

        socket.on(NEXT_QUESTION, async (roomId) => {
            sendEvent(io, roomId,NEXT_QUESTION, EMPTY);
        })

        socket.on(END_TEST, async (answers) => {
            console.log("RECIBIDO FIN DE TEST!");
            console.log("RESPUESTA DE USUARIOS!");
            console.log(answers);
            const results = await testController.getUsersResults(rooms.get(answers.roomId), answers.answers);
            sendEvent(io, answers.roomId, END_TEST, results);
            testMap.delete(answers.roomId);
            rooms.delete(answers.roomId)
        })
    });
}

function addUser(testId, username, roomId, isMaster, isGuest){
    if(rooms.has(roomId)){
        rooms.get(roomId).master = isMaster ? username : rooms.get(roomId).master;
        isMaster ? null : rooms.get(roomId).users.push(username);
        isGuest ? rooms.get(roomId).guests.push(username) : null;
    }else{
        const roomInfo = {roomId: roomId, users:[], testId: testId, started: false, guests: []}
        isMaster ? roomInfo.master=username : roomInfo.users.push(username);
        isGuest ? roomInfo.guests.push(username) : null;
        rooms.set(roomId, roomInfo);
    }
}

function hasTestStarted(roomCode){
    if(rooms.has(roomCode)){
        if(rooms.get(roomCode).started){
            return true;
        }
    }
    return false;
}

async function userAlreadyExists(roomCode, username, isGuest){
    // Search username in room map
    console.log("SEARCHINGG" + roomCode)
    if(rooms.has(roomCode)){
        console.log("SEARCHING")
        console.log(rooms.get(roomCode))
        if(rooms.get(roomCode).master == username){
            return true;
        }
        for(let user of rooms.get(roomCode).users){
            if(user==username){
                return true;
            }
        }
    }
    if(isGuest){
        const user = await userSelector.getUser(username, username);
        if(user.length>0){
            return true;
        }
    }
    return false;
}

function sendEvent(io, roomId, eventName, info){
    io.to(roomId).emit(eventName,info);
}

// return if it is needed to inform users (true or false)
function removeUser(username, roomId, isGuestUser){
    if(rooms.has(roomId)){
        const roomInfo = rooms.get(roomId);
        if(roomInfo.master == username){
            delete roomInfo.master;
        }else{
            if(roomInfo.users.indexOf(username)>=0){
                roomInfo.users.splice(roomInfo.users.indexOf(username), 1);
            }
            if(isGuestUser && roomInfo.guests.indexOf(username)>=0){
                roomInfo.guests.splice(roomInfo.guests.indexOf(username), 1);
            }
        }
        if(roomInfo.master==undefined && roomInfo.users.length==0){
            rooms.delete(roomId);
            return false;
        }
        return true;
    }
    return true;
}

module.exports = sockets;