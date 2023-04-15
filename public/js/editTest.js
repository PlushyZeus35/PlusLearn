let animation = bodymovin.loadAnimation({
    container: document.getElementById('noDataAnimation'),
    path: '/static/lottie/noData.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})


init();

function init(){
    enableTooltips();
    $('#allQuestionsInput')[0].checked = true;
    $('#codeInput')[0].checked = false;
    $('#copiedSVG')[0].classList.add('hide');
    showQuestionsRangeInput(false);
    showInteractiveCodeInput(false);

    //$('#stadisticContainer2')[0].classList.add('d-none');

}

// On change event on allQuestionsInput checkbox
function onChangeAllQuestionsCheckbox(){
    const isAllQuestionCheckboxChecked = $('#allQuestionsInput')[0].checked;
    if(isAllQuestionCheckboxChecked){
        // Hide range input
        showQuestionsRangeInput(false);

    }else{
        // Show range input
        showQuestionsRangeInput(true);
    }
}

function onChangeInteractiveSwitch(){
    const isInteractiveSwitchChecked = $('#interactiveInput')[0].checked;
    if(isInteractiveSwitchChecked){
        showInteractiveCodeInput(true);
    }else{
        showInteractiveCodeInput(false);
    }
}

function showQuestionsRangeInput(show){
    if(show){
        const questionsRangeInput = $('#questionsInput')[0];
        if(questionsRangeInput.classList.contains('hide')){
            questionsRangeInput.classList.remove('hide');
        }
    }else{
        const questionsRangeInput = $('#questionsInput')[0];
        if(!questionsRangeInput.classList.contains('hide')){
            questionsRangeInput.classList.add('hide');
        }
    }
}

function showInteractiveCodeInput(show){
    if(show){
        const interactiveCodeInput = $('#interactiveCodeInput')[0];
        if(interactiveCodeInput.classList.contains('hide')){
            interactiveCodeInput.classList.remove('hide');
        }
    }else{
        const interactiveCodeInput = $('#interactiveCodeInput')[0];
        if(!interactiveCodeInput.classList.contains('hide')){
            interactiveCodeInput.classList.add('hide');
        }
    }
}

function onClickCopyCode(){
    var copyText = $('#codeInput')[0];
    navigator.clipboard.writeText(copyText.value);
    showCopiedSVG(3);
}

function enableTooltips(){
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function showCopiedSVG(seconds){
    const copiedSvg = $('#copiedSVG')[0];
    const noCopiedSVG = $('#noCopiedSVG')[0];
    if(copiedSvg.classList.contains('hide')){
        noCopiedSVG.classList.add('hide');
        copiedSvg.classList.remove('hide');
        setTimeout(function() {
            copiedSvg.classList.add('hide');
            noCopiedSVG.classList.remove('hide');
        }, 1000*seconds);
    }
}

function onClickStadisticsButton(){
    const stadisticContainer2 = $('#stadisticContainer2')[0];
    const stadisticContainer1 = $('#stadisticContainer1')[0];

    stadisticContainer1.classList.toggle('d-none');
    stadisticContainer2.classList.toggle('d-none');
}

function onClickDeleteAnswerButton(id){
    const searchId = '#aditionalIncorrectAnswer' + id;
    console.log(searchId);
    $(searchId)[0].remove();
}

function onClickAddNewAnswer(){
    const existingIncorrectAnswers = $('.incorrectAnswer');
    const nextId = existingIncorrectAnswers.length + 1;
    createNewIncorrectAnswer(nextId);
}

function createNewIncorrectAnswer(id){
    const inputGroup = document.createElement('div');
    inputGroup.classList.add('input-group');
    inputGroup.classList.add('mb-3');
    inputGroup.classList.add( 'incorrectAnswer')
    inputGroup.id = "aditionalIncorrectAnswer" + id;

    const removeButton = document.createElement('button');
    removeButton.classList.add('btn');
    removeButton.classList.add('btn-outline-danger');
    removeButton.id = id;
    removeButton.type = 'button';
    removeButton.onclick = function(){
        onClickDeleteAnswerButton(id);
    }
    removeButton.innerHTML =    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                </svg>`;
    
    const formFloating = document.createElement('div');
    formFloating.classList = ['form-floating'];

    const inputAnswer = document.createElement('input');
    inputAnswer.classList = ['form-control'];
    inputAnswer.placeholder = 'Respuesta incorrecta';
    inputAnswer.id = 'incorrectAnswerInput' + id;

    const inputLabel = document.createElement('label');
    inputLabel.for = inputAnswer.id;
    inputLabel.innerHTML = "Respuesta incorrecta";

    formFloating.appendChild(inputAnswer);
    formFloating.appendChild(inputLabel);

    inputGroup.appendChild(removeButton);
    inputGroup.appendChild(formFloating);
    console.log("a")
    $('#additionalIncorrectAnswers')[0].appendChild(inputGroup);
}