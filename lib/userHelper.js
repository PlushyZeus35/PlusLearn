const databaseHelper = require('../lib/databaseHelper');
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

module.exports = userHelper;