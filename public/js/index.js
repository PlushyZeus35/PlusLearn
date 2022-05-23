

function passwordChange(){
    var passwordField = $("#inputSignUpPassword");
    var passwordRepeatField = $("#inputSignUpPasswordRepeat");
    var signUpButton = $("#signUpButton");
    var incorrectPasswordSvg = $("#incorrectPasswordSvg");
    var correctPasswordSvg = $("#correctPasswordSvg");
    
    // Check if password is valid
    if(isValidPassword(passwordField.val()) && areSamePasswords(passwordField.val(), passwordRepeatField.val())){
        // If password is valid
        // Set Sign Up Button enabled
        if(signUpButton.hasClass("disabled"))
            signUpButton.removeClass( 'disabled' );
        // Set Correct Password Svg visible
        if(correctPasswordSvg.hasClass("d-none"))
            correctPasswordSvg.removeClass('d-none');
        // Set Incorrect Password Svg invisible
        if(!incorrectPasswordSvg.hasClass('d-none'))
            incorrectPasswordSvg.addClass('d-none');

    }else {
        // If password is not valid
        // Set Sign Up Button disabled
        if(!signUpButton.hasClass("disabled"))
            signUpButton.addClass('disabled');
        // Set Correct Password Svg invisible
        if(!correctPasswordSvg.hasClass("d-none"))
            correctPasswordSvg.addClass('d-none');
        // Set Incorrect Password Svg visible
        if(incorrectPasswordSvg.hasClass('d-none'))
            incorrectPasswordSvg.removeClass('d-none');
    }
}

function isValidPassword(password){
    if(password == null || password == '' || password.length < 8 || !hasNumbers(password))
        return false;
    return true;
}

function hasNumbers(password){
    for(var i=1; i<password.length; i++){
        if(isNumber(password.charAt(i)))
            return true;
    }
    return false;
}

function isNumber(char) {
    if (typeof char !== 'string') {
      return false;
    }
  
    if (char.trim() === '') {
      return false;
    }
  
    return !isNaN(char);
}

function areSamePasswords(password, passwordRepeat){
    if(password.localeCompare(passwordRepeat) == 0)
        return true;
    return false;
}