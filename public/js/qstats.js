const test = dataFromServer.test;
let questionsData;
let questionsStats;
initialice();

function initialice(){
    setLoadingAnimations();
	initData();
    getServerData();
}

function setLoadingAnimations(){
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
    $("#loading1")[0].innerHTML = '';
}

function initData(){
    $("#testTitle")[0].innerHTML = test.title;
	$("#testDescription")[0].innerHTML = test.description;
	$("#createdTimestamp")[0].innerHTML = test.createdTimestamp;
	$("#updatedTimestamp")[0].innerHTML = test.updatedTimestamp;
	$("#interactiveCode")[0].innerHTML = test.interactiveCode;
    $("#showResponsesButton")[0].href = '/test/responses/' + test.id;
    $("#modifyTestButton")[0].href = '/test/' + test.id;
}

function getStatsData(){
    axios.get('/test/getQuestionsStadistics/' + test.id)
		.then(function (response) {
            questionsStats = response.data;
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.finally(function () {
			// always executed
		});
}

function getServerData(){
    const statsUrl = '/test/getQuestionsStadistics/' + test.id;
    const dataUrl = '/test/getdata/' + test.id;
    const promise1 = fetchData(statsUrl);
    const promise2 = fetchData(dataUrl);
    Promise.all([promise1, promise2])
  .then(([data1, data2]) => {
    // Aquí puedes realizar cualquier acción con los datos recibidos
    const serverStats = data1.validationCounter;
    const questionsCounter = data1.questionCounter;
    const answerCounter = data1.answersCounter;
    const testData = data2;
    const questions = testData.questions;
    questions.sort((a, b) => a.order - b.order);
    setQuestionsList(questions, serverStats, answerCounter);

  })
  .catch(error => console.error('Error:', error));
}

function setQuestionsList(questions, stats, answerCounter){
    hideLoader();
    const questionList = $("#questionsList")[0];
    /*
    .question 
        .questionTitle.d-flex.align-items-center
            span.questOrder.px-3 1
            h4 Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, exercitationem iure totam pariatur natus labore!
        .questionStats.d-flex.align-items-center 
            .questChart
                canvas#chart1 
            .questTable
                table.table.table-borderless.table-hover
                    thead
                        tr
                            th(scope='col') Nombre
                            th(scope='col') Contador
                    tbody
                        tr
                            td Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, aspernatur?
                            td 4
                        tr
                            td Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, aspernatur?
                            td 4
                        tr
                            td Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, aspernatur?
                            td 4
                        tr
                            td Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, aspernatur?
                            td 4
    */
    for(let question of questions){
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question');

        const questionTitleContainer = document.createElement('div');
        questionTitleContainer.classList.add('questionTitle');
        questionTitleContainer.classList.add('d-flex');
        questionTitleContainer.classList.add('align-items-center');

        const questOrder = document.createElement('span');
        questOrder.classList.add('questOrder');
        questOrder.classList.add('px-3');
        questOrder.innerHTML = question.order;

        const questTitle = document.createElement('h4');
        questTitle.innerHTML = question.title;

        questionTitleContainer.appendChild(questOrder);
        questionTitleContainer.appendChild(questTitle);
        questionContainer.appendChild(questionTitleContainer);

        const statsContainer = document.createElement('div');
        statsContainer.classList.add('questionStats');
        statsContainer.classList.add('d-flex');
        statsContainer.classList.add('align-items-center');
        statsContainer.classList.add('flex-column');
        statsContainer.classList.add('flex-md-row');

        const chartContainer = document.createElement('div');
        chartContainer.classList.add('questChart');

        const chartCanvas = document.createElement('canvas');
        const canvasId = 'chartq' + question.id;
        chartCanvas.id = canvasId;
        chartContainer.appendChild(chartCanvas);
        statsContainer.appendChild(chartContainer);

        const tableContainer = document.createElement('div');
        tableContainer.classList.add('questTable');
        const tableData = getTable(question, answerCounter);
        tableContainer.appendChild(tableData);
        statsContainer.appendChild(tableContainer);
        questionContainer.appendChild(statsContainer);
        questionList.appendChild(questionContainer);

        runQuestionChart(canvasId, question, stats);
    }
    
    


    /*const data = {
		labels: [
		'Correctas',
		'Incorrectas',
		'Sin contestar'
		],
		datasets: [{
		label: 'My First Dataset',
		data: [8,5,2],
		backgroundColor: [
			'rgb(51, 204, 51)',
			'rgb(255, 51, 0)',
			'rgb(102, 204, 255)'
		],
		hoverOffset: 4
		}]
	};
	const config = {
		type: 'pie',
		data: data,
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins:{
				title:{
					display: false
				}
			}
		}
	};
	const ctx = document.getElementById('chart1');
	new Chart(ctx, config);*/
}

function runQuestionChart(canvasId, questionInfo, statInfo){
    const statData = statInfo.filter((i) => i.questionId == questionInfo.id)[0];
    const data = {
		labels: [
		'Correctas',
		'Incorrectas',
		'Sin contestar'
		],
		datasets: [{
		label: 'My First Dataset',
		data: [statData.correct,statData.incorrect,statData.empty],
		backgroundColor: [
			'rgb(51, 204, 51)',
			'rgb(255, 51, 0)',
			'rgb(102, 204, 255)'
		],
		hoverOffset: 4
		}]
	};
	const config = {
		type: 'pie',
		data: data,
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins:{
				title:{
					display: false
				}
			}
		}
	};
	const ctx = document.getElementById(canvasId);
	new Chart(ctx, config);
}

function getTable(questionInfo, answersCounter){
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-borderless');
    table.classList.add('table-hover');

    const tableHead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const nameHead = document.createElement('th');
    nameHead.innerHTML = 'Respuesta';
    const counterHead = document.createElement('th');
    counterHead.innerHTML = 'Contador';
    trHead.appendChild(nameHead);
    trHead.appendChild(counterHead);
    tableHead.appendChild(trHead);
    table.appendChild(tableHead)

    const tableBody = document.createElement('tbody');
    const correctAnswer = document.createElement('tr');
    const correctAnswerTitle = document.createElement('td');
    correctAnswerTitle.innerHTML = questionInfo.correctAnswer.name;
    const correctAnswerCounter = document.createElement('td');
    const corrAnsCounter = answersCounter.filter((i) => i.answerId == questionInfo.correctAnswer.id);
    if(corrAnsCounter.length==0){
        correctAnswerCounter.innerHTML = 0;
    }else{
        correctAnswerCounter.innerHTML = corrAnsCounter[0].counter;
    }
    correctAnswer.appendChild(correctAnswerTitle);
    correctAnswer.appendChild(correctAnswerCounter);
    tableBody.appendChild(correctAnswer);
    console.log(answersCounter);
    for(let eachincorrectAnswer of questionInfo.incorrectAnswers){
        console.log(eachincorrectAnswer)
        const incorrectAnswer = document.createElement('tr');
        const incorrectAnswerTitle = document.createElement('td');
        incorrectAnswerTitle.innerHTML = eachincorrectAnswer.name;
        const incorrectAnswerCounter = document.createElement('td');
        const ansCounter = answersCounter.filter((i) => i.answerId == eachincorrectAnswer.id);
        if(ansCounter.length==0){
            incorrectAnswerCounter.innerHTML = 0;
        }else{
            incorrectAnswerCounter.innerHTML = ansCounter[0].counter;
        }
        incorrectAnswer.appendChild(incorrectAnswerTitle);
        incorrectAnswer.appendChild(incorrectAnswerCounter);
        tableBody.appendChild(incorrectAnswer);
    }
    table.appendChild(tableBody);
    return table;
}

function fetchData(url){
    return axios.get(url)
        .then(response => response.data)
        .catch(error => console.error('Error fetching data:', error));
}

function getQuestionsData(){
    axios.get('/test/getdata/' + test.id)
        .then(function (response) {
            
            questionsData = response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}