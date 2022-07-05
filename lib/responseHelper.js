const databaseHelper = require('../lib/databaseHelper');
const moment = require('moment-timezone')
const { DateTime } = require('luxon');
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

responseHelper.getSevenDayCountResponses = async () => {
    const sDaysDates = [];
    const result = [];
    for(i=0; i<=7; i++){
        let date = DateTime.now().minus({days: i}).toJSDate();
        sDaysDates.push(date);
    }
    const lastDay = sDaysDates[7];
    const responses = await databaseHelper.getResponsesAfterDate(lastDay);
    console.log(JSON.stringify(responses));
    sDaysDates.forEach(function(fecha){
        var res = {
            date: fecha,
            counter: 0
        }
        responses.forEach(function(response){
            if(response.createdAt.toISOString().substring(0, 10) == fecha.toISOString().substring(0, 10)){
                res.counter++;
            }
        })
        result.push(res);
    })
    console.log(result);
    
    console.log(responses[0].createdAt.toISOString().substring(0, 10));
    console.log(lastDay.toISOString().substring(0, 10));
    return result;
}

module.exports = responseHelper;