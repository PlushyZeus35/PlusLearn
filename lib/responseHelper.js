const databaseHelper = require('../lib/databaseHelper');
const moment = require('moment-timezone')
const responseHelper = {};

responseHelper.getQuizResponses = async (quizId) => {
    try{
        let responses = await databaseHelper.getQuizResponses(quizId);
        //let responsess = responses;
        let result = {
            notaMedia: 0,
            notaMaxima: 0,
            notaMinima: 0,
            responses: []
        }
        let usersId = [];
        console.log("USUARIOS!");
        for(i=0; i<responses.length; i++){
            let element = responses[i];
            let user = await databaseHelper.getUserById(element.userId);
            console.log(user);
            const response = {
                username: user.username,
                nota: element.nota,
                fecha: moment.tz(element.createdAt, "Europe/Madrid").format()
            };
            result.responses.push(response);
            console.log("añadido uno");
            console.log(result.responses);
        }
        
        console.log("RESULTADOS BRO!")
        console.log(result);
        return result;
    }catch(e){
        console.log(e);
    }
}

module.exports = responseHelper;