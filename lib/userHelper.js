const databaseHelper = require('../lib/databaseHelper');
const { DateTime } = require('luxon');
const userHelper = {};

userHelper.isValidEmail =  (emailAdress) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
        return true; 
    } else {
        return false; 
    }
}

userHelper.isUsernameRepeated = async (username) => {
    const result = await databaseHelper.getUserByUsername(username);
    if(result.length > 0)
        return true;
    return false;
}

userHelper.countNormalUsers = async () => {
    return await databaseHelper.howManyUsers();
}


userHelper.getSevenDayCountUsers = async () => {
    const sDaysDates = [];
    const result = [];
    for(i=0; i<=7; i++){
        let date = DateTime.now().minus({days: i}).toJSDate();
        sDaysDates.push(date);
    }
    const lastDay = sDaysDates[7];
    const users = await databaseHelper.getUsersAfterDate(lastDay);
    console.log(JSON.stringify(users));
    sDaysDates.forEach(function(fecha){
        var res = {
            date: fecha,
            counter: 0
        }
        users.forEach(function(user){
            if(user.createdAt.toISOString().substring(0, 10) == fecha.toISOString().substring(0, 10)){
                res.counter++;
            }
        })
        result.push(res);
    })
    console.log(result);
    
    console.log(users[0].createdAt.toISOString().substring(0, 10));
    console.log(lastDay.toISOString().substring(0, 10));
    return result;
}

module.exports = userHelper;