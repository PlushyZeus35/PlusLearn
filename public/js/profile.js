function deleteUser(){
    axios.delete('/user/' + dataFromServer.user.id)
		.then(function (response) {
			window.location.href = "/auth/logout";
		})
		.catch(function (error) {
			console.log(error);
		});
}

function updateUser(){
    const email = $("#emailInput")[0].value;
    if(email == dataFromServer.user.email){
        setUpdateErrorAlert('Ese ya es tu correo electrónico');
    }else if(email!='' && email!=undefined && validateEmail(email)){
        axios.post('/user', {
            id: dataFromServer.user.id,
            email: email
          })
          .then(function (response) {
			if(response.data.error){
                window.location.href = "/error";
            }
            console.log(response);
            if(response.data.status){
                location.reload();
            }else{
                setUpdateErrorAlert('Ese correo electrónico ya está siendo utilizado en la plataforma.');
            }
          })
          .catch(function (error) {
            window.location.href = "/error";
          });
    }else{
        setUpdateErrorAlert('Especifica un correo electrónico valido.');
    }
    
}

function validateEmail(correo){
    // Expresión regular para validar el formato del correo electrónico
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Comprobar si el correo coincide con el patrón
    return patronCorreo.test(correo);
}

function setUpdateErrorAlert(alertText){
    const alert = document.createElement('div');
    alert.classList.add('alert');
    alert.classList.add('alert-warning');
    alert.innerHTML = alertText;
    $("#alertContainer")[0].innerHTML = '';
    $("#alertContainer")[0].appendChild(alert);
}