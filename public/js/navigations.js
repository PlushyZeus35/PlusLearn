function goToHome(){
    window.location.href = '/home';
}

function logOut(){
    window.location.href = '/auth/logout';
}

function goToTest(){
    const codeInput = $("#codeInput");
    if(codeInput.length>0){
        const codeValue = codeInput[0].value;
        if(codeValue != '' && codeValue != undefined){
            window.location.href = '/test/d/' + codeValue;
        }
    }
}