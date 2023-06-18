const sockets = {};
const { Server } = require("socket.io");
const testSelector = require("./testSelector");
const userSelector = require("./userSelector")
/*
const room = {
    roomId: 'XXXXX',
    master: userId(usernames),
    users: [userId, userId, userId]
}
*/
const rooms = new Map();
const userMap = new Map();

sockets.initialice = async (server) => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('a user connected');

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });

        socket.on('disconnecting',async () => {
            if(userMap.has(socket.id)){
                const userInfo = userMap.get(socket.id);
                userMap.delete(socket.id);
                if(removeUser(userInfo.username, userInfo.roomId)){
                    io.to(userInfo.roomId).emit('userconnect',rooms.get(userInfo.roomId));
                }
            }
            console.log(rooms);
            console.log(userMap);
        })

        // Conect a user to a room
        socket.on('room-connection', async (connectionInfo) => {
            console.log(socket.id)
            userMap.set(socket.id, {username: connectionInfo.username, roomId: connectionInfo.roomId})

            if(connectionInfo.isGuestUser){
                console.log('usuario no identificado y no master')
                addUser(connectionInfo.username, connectionInfo.roomId, false)
            }else{
                const user = await userSelector.getUser(connectionInfo.username, connectionInfo.username);
                const test = await testSelector.checkInteractiveCode(connectionInfo.roomId);
                console.log(user);
                console.log(test)
                if(user!=null && test!=null && user.length>0 && test[0].userId==user[0].id){
                    console.log('usuario identificado y master')
                    addUser(connectionInfo.username, connectionInfo.roomId, true);
                }else{
                    console.log('usuario identificado y no master')
                    addUser(connectionInfo.username, connectionInfo.roomId, false);
                }
            }
            socket.join(connectionInfo.roomId)
            console.log(rooms);
            console.log(userMap);
            io.to(connectionInfo.roomId).emit('userconnect',rooms.get(connectionInfo.roomId));
        })
    });
}

function addUser(username, roomId, isMaster){
    if(rooms.has(roomId)){
        rooms.get(roomId).master = isMaster ? username : rooms.get(roomId).master;
        isMaster ? null : rooms.get(roomId).users.push(username);
    }else{
        const roomInfo = {roomId: roomId, users:[]}
        isMaster ? roomInfo.master=username : roomInfo.users.push(username);
        rooms.set(roomId, roomInfo);
    }
}

// return if it is needed to inform users (true or false)
function removeUser(username, roomId){
    if(rooms.has(roomId)){
        const roomInfo = rooms.get(roomId);
        if(roomInfo.master == username){
            delete roomInfo.master;
        }else{
            if(roomInfo.users.indexOf(username)>=0){
                roomInfo.users.splice(roomInfo.users.indexOf(username), 1);
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