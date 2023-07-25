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
    console.log("asdf");
    console.log(responses);
    console.log(responses.length)
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

        accordionCollapse.appendChild(accordionBody);
        accordionHeader.appendChild(accordionHeaderButton);
        accordionItem.appendChild(accordionHeader);
        accordionItem.appendChild(accordionCollapse);
        collapsedList.appendChild(accordionItem);
    }
    hideLoader();
}