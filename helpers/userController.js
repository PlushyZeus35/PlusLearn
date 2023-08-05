const userController = {};
const userSelector = require('./userSelector');
const emailController = require('./emailController');
const Crypt = require('./crypt');
const {DateTime} = require('luxon');

userController.getPasswordResetCode = async (userId, userMail) => {
    const passReset = await userSelector.getUserPasswordReset(userId);
    let code = '';
    if(passReset.length>0){
        code = passReset[0].code;
    }else{
        let alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
        let numbers = '1234567890'.split('');
        let codeCharacters = alphabet.concat(numbers);
        do{
            code = '';
            for(let i=0; i<10 ; i++){
                let random = Math.floor(Math.random() * codeCharacters.length);
                code += codeCharacters[random];
            } 
        }while(await userSelector.checkPasswordResetCode(code).lenth>0);
        await userSelector.setUserPasswordReset(code, userId);
    }
    emailController.sendEmail(userMail, 'Reseteo de password', 'Tu código de reseteo de contraseña es el siguiente: ' + code);   
}

userController.updatePassword = async (password, code, username) => {
    const targetUser = await userSelector.getUser(username, username);
    const resetPassword = await userSelector.getUserPasswordReset(targetUser[0].id);
    if(resetPassword[0].code == code){
        const cipherPassword = Crypt.hashPassword(password);
        await userSelector.updateUserPassword(targetUser[0].id, cipherPassword);
        await userSelector.deactivatePasswordReset(targetUser[0].id);
        return true;
    }
    return false;
}

userController.parseUserData = (user) => {
    const lastLogin = new Date(user.lastLogin);
    const userToReturn = {
        id: user.id,
        username: user.username,
        email: user.email,
        lastLogin: DateTime.fromISO(lastLogin.toISOString()).setLocale('es').toRelativeCalendar()
    }
    return userToReturn;
}

userController.updateEmail = async (userId, userMail) => {
    const user = await userSelector.getUser(userMail, userMail);
    if(user.length!=0){
        return {status: false}
    }
    await userSelector.updateEmail(userId, userMail);
    return {status: true}
}

userController.deleteUser = async (userId) => {
    const user = await userSelector.deleteUser(userId);
    return {status: true}
}

module.exports = userController;