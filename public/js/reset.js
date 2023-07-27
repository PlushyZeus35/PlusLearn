let codeCreated = false;
let changePass = false;
let usernameSelected = '';
let codeSelected = '';

function resetPasswordOnClick(){
    if(!codeCreated){
        const username = $("#username")[0].value;
        usernameSelected = username;
        if(username!='' && username!=null){
            axios.post('/reset', {
                username: username
            })
            .then(function (response) {
                if(response.data.status){
                    const cardBody = $("#cardBody")[0];
                    $("#cardBody")[0].innerHTML = ''
                    const info = document.createElement('p');
                    info.classList.add('text-white')
                    info.innerHTML = 'Introduce aquí el código que te hemos enviado a tu email';
                    
                    const formFloating = document.createElement('div');
                    formFloating.classList.add('form-floating');
                    formFloating.classList.add('mb-3');

                    const codeInput = document.createElement('input');
                    codeInput.classList.add('form-control');
                    codeInput.id = 'codeInput';
                    codeInput.type = 'text';
                    codeInput.placeholder = 'Código';

                    const codeLabel = document.createElement('label');
                    codeLabel.innerHTML = 'Código';
                    codeLabel.setAttribute('for', 'codeInput');

                    formFloating.appendChild(codeInput);
                    formFloating.appendChild(codeLabel);
                    cardBody.appendChild(info);
                    cardBody.appendChild(formFloating);
                    codeCreated=true;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        } 
    }else if(!changePass){
        const code = $("#codeInput")[0].value;
        axios.get('/resetCode?code=' + code)
        .then(function (response) {
            if(response.data.status){
                codeSelected = code;
                showChangePasswordInputs();
                changePass = true;
            }   
        })
    }else{
        changePasswordServer();
    }
}

function showChangePasswordInputs(){
    const cardBody = $("#cardBody")[0];
    cardBody.innerHTML = ''

    const passwordInput = document.createElement('div');
    passwordInput.classList.add('form-floating');
    passwordInput.classList.add('mb-3');
    
    const passInput = document.createElement('input');
    passInput.classList.add('form-control');
    passInput.id = 'passwordInput';
    passInput.type = 'password';
    passInput.placeholder = 'Contraseña';

    const passLabel = document.createElement('label');
    passLabel.setAttribute('for', 'passwordInput');
    passLabel.innerHTML = 'Contraseña';

    passwordInput.appendChild(passInput);
    passwordInput.appendChild(passLabel);
    cardBody.appendChild(passwordInput);

    const passwordInput2 = document.createElement('div');
    passwordInput2.classList.add('form-floating');
    passwordInput2.classList.add('mb-3');
    
    const passInput2 = document.createElement('input');
    passInput2.classList.add('form-control');
    passInput2.id = 'passwordInputRep';
    passInput2.type = 'password';
    passInput2.placeholder = 'Repetir contraseña';

    const passLabel2 = document.createElement('label');
    passLabel2.setAttribute('for', 'passwordInputRep');
    passLabel2.innerHTML = 'Repetir contraseña';

    passwordInput2.appendChild(passInput2);
    passwordInput2.appendChild(passLabel2);
    cardBody.appendChild(passwordInput2);
}

function changePasswordServer(){
    const password = $("#passwordInput")[0].value;
    const repPassword = $("#passwordInputRep")[0].value;
    if(password!='' && password==repPassword){
        axios.post('/changePassword', {
            username: usernameSelected,
            password: password,
            code: codeSelected
        })
        .then(function (response) {
            if(response.data.status){
                console.log("CHANGED")
                window.location.href = '/login';
            }else{
                console.log("NOT CHANGED")
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}