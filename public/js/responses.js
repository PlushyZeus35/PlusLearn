let testId;
let test = dataFromServer.test;
initialice();

function initialice(){
    initLoaders();
    initData();
    testId = dataFromServer.test.id;
    getServerData(testId);
}

function initLoaders(){
    let animation = bodymovin.loadAnimation({
        container: document.getElementById('loadingAnimation'),
        path: '/static/lottie/loading.json',
        render: 'svg',
        loop: true,
        autoplay: true,
        name: 'animation name'
    })
}

function hideLoader(){
    $("#loading1")[0].innerHTML = ''
}

function initData(){
	$("#testTitle")[0].innerHTML = test.title;
	$("#testDescription")[0].innerHTML = test.description;
	$("#createdTimestamp")[0].innerHTML = test.createdTimestamp;
	$("#updatedTimestamp")[0].innerHTML = test.updatedTimestamp;
	$("#interactiveCode")[0].innerHTML = test.interactiveCode;
    $("#statsButtonLink")[0].href = '/test/stats/' + test.id;
}

function getServerData(testId){
    axios.get('/test/useresponses/' + test.id)
    .then(function (response) {
        console.log(response.data);
        constructAccordion(response.data.responses);
       
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });
}

function constructAccordion(responses){
    /*
    .accordion-item
        h2.accordion-header
            button.accordion-button.collapsed(type='button' data-bs-toggle='collapse' data-bs-target='#collapseOne' aria-expanded='false' aria-controls='collapseOne')
                | Accordion Item #1
        #collapseOne.accordion-collapse.collapse(data-bs-parent='#accordionResponses')
            .accordion-body
                strong This is the first item&apos;s accordion body.
                |  It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It&apos;s also worth noting that just about any HTML can go within the 
                code .accordion-body
                | , though the transition does limit overflow.
    */
    const collapsedList = $("#accordionResponses")[0];
    for(let testResponse of responses){
        let accordionItem = document.createElement('div');
        accordionItem.classList.add('accordion-item');

        let accordionHeader = document.createElement('h2');
        accordionHeader.classList.add('accordion-header');
        
        let accordionHeaderButton = document.createElement('button');
        accordionHeaderButton.classList.add('accordion-button');
        accordionHeaderButton.classList.add('collapsed');
        accordionHeaderButton.type = 'button';
        accordionHeaderButton.setAttribute('data-bs-toggle','collapse');
        accordionHeaderButton.setAttribute('data-bs-target','#'+testResponse.id);
        accordionHeaderButton.setAttribute('aria-expanded','false');
        accordionHeaderButton.setAttribute('aria-controls',testResponse.id);
        accordionHeaderButton.innerHTML = testResponse.user;

        let accordionCollapse = document.createElement('div');
        accordionCollapse.id = testResponse.id;
        accordionCollapse.classList.add('accordion-collapse');
        accordionCollapse.classList.add('collapse');
        accordionCollapse.setAttribute('data-bs-parent','#'+testResponse.id);

        let accordionBody = document.createElement('div');
        accordionBody.classList.add('accordion-body');

        const progressBar = constructProgressBar(testResponse.responses);
        accordionBody.appendChild(progressBar);

        const table = constructResponseTable(testResponse.responses);
        accordionBody.appendChild(table);

        accordionCollapse.appendChild(accordionBody);
        accordionHeader.appendChild(accordionHeaderButton);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        collapsedList.appendChild(accordionItem);
    }
    hideLoader();
}

function constructProgressBar(responses){
    const correct = responses.filter((i) => i.isCorrect).length;
    const incorrect = responses.filter((i) => !i.isCorrect && !i.isEmpty).length;
    const empty = responses.filter((i) => i.isEmpty).length;
    const all = responses.length;
    const correctProp = ((correct * 100) / all).toFixed(2);
    const incorrectProp = ((incorrect * 100) / all).toFixed(2);
    const emptyProp = ((empty * 100) / all).toFixed(2);
    
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-stacked');

    const correctProgress = document.createElement('div');
    correctProgress.classList.add('progress');
    correctProgress.role = 'progressbar';
    correctProgress.ariaLabel = 'Correct Prop';
    correctProgress.ariaValueNow = correctProp;
    correctProgress.ariaValueMin = '0';
    correctProgress.ariaValueMax = '100';
    correctProgress.style = "width: " + parseFloat(correctProp) + "%";
    const correctProgressBar = document.createElement('div');
    correctProgressBar.classList.add('progress-bar');
    correctProgressBar.classList.add('bg-success');
    correctProgressBar.innerHTML = correctProp + '%';
    correctProgress.appendChild(correctProgressBar);
    progressBarContainer.appendChild(correctProgress);

    const incorrectProgress = document.createElement('div');
    incorrectProgress.classList.add('progress');
    incorrectProgress.role = 'progressbar';
    incorrectProgress.ariaLabel = 'Incorrect Prop';
    incorrectProgress.ariaValueNow = incorrectProp;
    incorrectProgress.ariaValueMin = '0';
    incorrectProgress.ariaValueMax = '100';
    incorrectProgress.style = "width: " + parseFloat(incorrectProp) + "%";
    const incorrectProgressBar = document.createElement('div');
    incorrectProgressBar.classList.add('progress-bar');
    incorrectProgressBar.innerHTML = incorrectProp + '%';
    incorrectProgressBar.classList.add('bg-danger');
    incorrectProgress.appendChild(incorrectProgressBar);
    progressBarContainer.appendChild(incorrectProgress);

    const emptyProgress = document.createElement('div');
    emptyProgress.classList.add('progress');
    emptyProgress.role = 'progressbar';
    emptyProgress.ariaLabel = 'Empty Prop';
    emptyProgress.ariaValueNow = emptyProp;
    emptyProgress.ariaValueMin = '0';
    emptyProgress.ariaValueMax = '100';
    emptyProgress.style = "width: " + parseFloat(emptyProp) + "%";
    const emptyProgressBar = document.createElement('div');
    emptyProgressBar.classList.add('progress-bar');
    emptyProgressBar.innerHTML = emptyProp + '%';
    emptyProgressBar.classList.add('bg-secondary');
    emptyProgress.appendChild(emptyProgressBar);
    progressBarContainer.appendChild(emptyProgress);

    return progressBarContainer;
}

function constructResponseTable(responses){
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-borderless');
    table.classList.add('table-hover');

    const tableHead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const nameHead = document.createElement('th');
    nameHead.innerHTML = 'Pregunta';
    const counterHead = document.createElement('th');
    counterHead.innerHTML = 'Respuesta';
    trHead.appendChild(nameHead);
    trHead.appendChild(counterHead);
    tableHead.appendChild(trHead);
    table.appendChild(tableHead)

    const tableBody = document.createElement('tbody');

    for(let eachResponse of responses){
        console.log(eachResponse);
        const response = document.createElement('tr');
        const responseQuestion = document.createElement('td');
        if(eachResponse.isCorrect){
            responseQuestion.classList.add('table-success');
        }else{
            responseQuestion.classList.add('table-danger');
        }
        responseQuestion.innerHTML = eachResponse.questionTitle;
        const responseSelected = document.createElement('td');
        responseSelected.innerHTML = eachResponse.title;

        response.appendChild(responseQuestion);
        response.appendChild(responseSelected);
        tableBody.appendChild(response);
    }
    table.appendChild(tableBody);
    return table;
}