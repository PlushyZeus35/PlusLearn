console.log({errorMessages, successMessages})

if(errorMessages && errorMessages.length>0){
    const toastTemplate = document.querySelectorAll('#toastError');
    if(toastTemplate.length>0){
        document.querySelectorAll('#errorToastBody')[0].innerHTML = errorMessages[0];
        const toastInit = new bootstrap.Toast(toastTemplate[0]);
        toastInit.show();
    }
}

if(successMessages && successMessages.length>0){
    const toastTemplate = document.querySelectorAll('#toastSuccess');
    if(toastTemplate.length>0){
        document.querySelectorAll('#successToastBody')[0].innerHTML = successMessages[0];
        const toastInit = new bootstrap.Toast(toastTemplate[0]);
        toastInit.show();
    }
    console.log(toastTemplate)
}