console.log(flashMessages);
console.log(flashSuccesses);

if(flashMessages.length>0){
    for(let i=0; i<flashMessages.length; i++){
        const toastLiveExample = document.getElementById('messageToast');
        const messageText = document.getElementById('message');
        messageText.innerHTML = flashMessages[i];
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }
    
}

if(flashSuccesses.length>0){
    for(let i=0; i<flashSuccesses.length; i++){
        const toastLiveExample = document.getElementById('successToast');
        const successText = document.getElementById('successText');
        successText.innerHTML = flashSuccesses[i];
        const toast = new bootstrap.Toast(toastLiveExample);
        toast.show();
    }
}