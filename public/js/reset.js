let codeCreated = false;
let changePass = false;
let usernameSelected = '';
let codeSelected = '';

const showFormNotification = (message) => {
    const formAlert = $("#formAlert");
    if(formAlert.length==0){
        const cardBody = $("#cardBody")[0];
        const alertContainer = document.createElement('div');
        alertContainer.classList.add('alertContainer');
        alertContainer.classList.add('alert');
        alertContainer.id = 'formAlert';
        alertContainer.innerHTML = message;
        cardBody.insertBefore(alertContainer, cardBody.firstChild);
    }else{
        formAlert[0].innerHTML = message;
    }
}

const checkUsernameOnClick = () => {
    console.log("asfd")
    const username = $("#username")[0].value;
    usernameSelected = username;
    if(username!='' && username!=null){
        axios.post('/reset', {
            username: username
        })
        .then(function (response) {
            if(response.data.error){
                window.location.href = "/error";
            }
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

                $("#changePassword")[0].classList.toggle('d-none');
                $("#insertCode")[0].classList.toggle('d-none');
            }else{
                showFormNotification('No existe un usuario con esa información.')
            }
        })
        .catch(function (error) {
            window.location.href = "/error";
        });
    }else{
        showFormNotification('Debes introducir un nombre de usuario o un correo electrónico.')
    }
}

const changePasswordOnClick = () => {
    const password = $("#passwordInput")[0].value;
    const repPassword = $("#passwordInputRep")[0].value;
    if(password=='' || password==null || password==undefined){
        showFormNotification('Debes especificar una nueva contraseña.');
        return 0;
    }
    if(password!=repPassword){
        showFormNotification('Las dos contraseñas no son iguales.');
        return 0;
    }
    axios.post('/changePassword', {
        username: usernameSelected,
        password: password,
        code: codeSelected
    })
    .then(function (response) {
        if(response.data.error){
            window.location.href = "/error";
        }
        if(response.data.status){
            window.location.href = '/login';
        }else{
            showFormNotification('Ha ocurrido un problema, inténtalo de nuevo.');
        }
    })
    .catch(function (error) {
        window.location.href = "/error";
    });
    
}

const insertCodeOnClick = () => {
    const code = $("#codeInput")[0].value;
    if(code=='' || code==undefined || code==null){
        showFormNotification('Debes introducir el código que se ha enviado a tu dirección de correo electrónico.');
        return 0;
    }
    axios.get('/resetCode?code=' + code)
    .then(function (response) {
        if(response.data.error){
            window.location.href = "/error";
        }
        if(response.data.status){
            codeSelected = code;
            showChangePasswordInputs();
            changePass = true;
        }else{
            showFormNotification('El código introducido no es válido.')
        }
    }).catch(function(error){
        window.location.href = "/error";
    })
}

function resetPasswordOnClick(){
    if(!codeCreated){
        const username = $("#username")[0].value;
        usernameSelected = username;
        if(username!='' && username!=null){
            axios.post('/reset', {
                username: username
            })
            .then(function (response) {
                if(response.data.error){
                    window.location.href = "/error";
                }
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
                window.location.href = "/error";
            });
        }else{
            showFormNotification('Debes introducir un nombre de usuario o un correo electrónico.')
        }
    }else if(!changePass){
        const code = $("#codeInput")[0].value;
        axios.get('/resetCode?code=' + code)
        .then(function (response) {
            if(response.data.error){
                window.location.href = "/error";
            }
            if(response.data.status){
                codeSelected = code;
                showChangePasswordInputs();
                changePass = true;
            }   
        }).catch(function(error){
            window.location.href = "/error";
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

    $("#changePassword")[0].classList.toggle('d-none');
    $("#changePassword")[0].onclick = changePasswordOnClick;
    $("#insertCode")[0].classList.toggle('d-none');
}
