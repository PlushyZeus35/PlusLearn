
class RoomData {
    constructor(){
        // rooms info
        this.rooms = new Map();
        // username group by socketid
        this.userMap = new Map();
        // map to get testanswers
        this.testMap = new Map();
    }

    /*
    * Guarda en el mapa rooms información del usuario
    * 
    */
    addUser(testId, username, roomId, isMaster, isGuest){
        if(this.rooms.has(roomId)){
            // Add user to master
            this.rooms.get(roomId).master = isMaster ? username : this.rooms.get(roomId).master;
            // Add user to user list
            isMaster ? null : this.rooms.get(roomId).users.push(username);
            // Add user to guest list
            isGuest ? this.rooms.get(roomId).guests.push(username) : null;
        }else{
            // Create map record
            const roomInfo = {roomId: roomId, users:[], testId: testId, started: false, guests: []}
            // Set user master and user lists
            isMaster ? roomInfo.master=username : roomInfo.users.push(username);
            isGuest ? roomInfo.guests.push(username) : null;
            this.rooms.set(roomId, roomInfo);
        }
    }

    removeUser(username, roomId, isGuestUser){
        if(this.rooms.has(roomId)){
            const roomInfo = this.rooms.get(roomId);
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
                this.destroyRoomInfo(roomId);
                return false;
            }
            return true;
        }
        return true;
    }

    addAnswer(roomId, selectedAnswer){
        if(this.testMap.has(roomId)){
            const questionsMap = this.testMap.get(roomId);
            if(questionsMap.has(selectedAnswer.questionId)){
                questionsMap.get(selectedAnswer.questionId).push(answersInfo.selectedAnswer);
            }else{
                questionsMap.set(selectedAnswer.questionId, [answersInfo.selectedAnswer]);
            }
        }else{
            this.testMap.set(roomId, new Map([[selectedAnswer.questionId, [selectedAnswer]]]));
        }
    }

    destroyRoomInfo(roomCode){
        rooms.delete(roomCode);
    }

    getRoomInfo(roomCode){

    }

}

module.exports = new RoomData();