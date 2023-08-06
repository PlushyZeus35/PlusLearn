const test = dataFromServer.test;

initialization();
function initialization(){
	setLoadingAnimations();
	initData();
	getGeneralStadisticsData();
	getQuestionsStadisticsData();
}

function initData(){
	$("#completeStatsButton")[0].href = '/test/qstats/' + test.id;
	$("#editTestButton")[0].href = '/test/' + test.id;
	$("#responsesButton")[0].href = '/test/responses/' + test.id;
	$("#testTitle")[0].innerHTML = test.title;
	$("#testDescription")[0].innerHTML = test.description;
	$("#createdTimestamp")[0].innerHTML = test.createdTimestamp;
	$("#updatedTimestamp")[0].innerHTML = test.updatedTimestamp;
	$("#interactiveCode")[0].innerHTML = test.interactiveCode;
}

function getQuestionsStadisticsData(){
	axios.get('/test/getQuestionsStadistics/' + test.id)
		.then(function (response) {
			if(response.data.error){
                window.location.href = "/error";
            }
			// handle success
			console.log(response);
			hideLoader2();
			setQuestionsStadistics(response.data);
		})
		.catch(function (error) {
			window.location.href = "/error";
		})
		.finally(function () {
			// always executed
		});
}

function getGeneralStadisticsData(){
	axios.get('/test/getGeneralStadistic/' + test.id)
		.then(function (response) {
			if(response.data.error){
                window.location.href = "/error";
            }
			// handle success
			console.log(response);
			hideLoader();
			setGeneralStadistics(response.data);
		})
		.catch(function (error) {
			window.location.href = "/error";
		})
		.finally(function () {
			// always executed
		});
}

function hideLoader(){
	$("#loading1")[0].innerHTML = '';
}

function hideLoader2(){
	$("#loading2")[0].innerHTML = '';
}

function setQuestionsStadistics(serverData){
	console.log(serverData);
	//#mainStat1.d-flex.justify-content-center.align-items-center.flex-column.col-12.col-md-6 
	//	span.statTitle Número de preguntas 
	//	span.statResult 10
	//.col-12.col-md-6.d-flex.justify-content-center.align-items-center.flex-column
	//	#questionStatContainer
	//		canvas#questionStat
	//#questionCorrectAnswerChartContainer.mb-3.col-12
	//	canvas#questionMainStat
	const statContainer = $("#questionsStadistics")[0];

	const mainStat = document.createElement('div');
	mainStat.id = 'mainStat1';
	mainStat.classList.add('d-flex');
	mainStat.classList.add('justify-content-center');
	mainStat.classList.add('align-items-center');
	mainStat.classList.add('flex-column');
	mainStat.classList.add('col-12');
	mainStat.classList.add('col-md-6');
	
	const statTitle = document.createElement('span');
	statTitle.classList.add('statTitle');
	statTitle.innerHTML = 'Número de preguntas';

	const statValue = document.createElement('span');
	statValue.classList.add('statResult');
	statValue.innerHTML = serverData.questionCounter;

	mainStat.appendChild(statTitle);
	mainStat.appendChild(statValue);

	//.col-12.col-md-6.d-flex.justify-content-center.align-items-center.flex-column
	const canvasRow = document.createElement('div');
	canvasRow.classList.add('col-12');
	canvasRow.classList.add('col-md-6');
	canvasRow.classList.add('d-flex');
	canvasRow.classList.add('justify-content-center');
	canvasRow.classList.add('align-items-center');
	canvasRow.classList.add('flex-column');

	const canvasContainer = document.createElement('div');
	canvasContainer.id = 'questionStatContainer';

	const chartCanvas = document.createElement('canvas');
	chartCanvas.id = 'questionStat';
	canvasContainer.appendChild(chartCanvas);
	canvasRow.appendChild(canvasContainer);

	//#questionCorrectAnswerChartContainer.mb-3.col-12
	const correctAnswerContainer = document.createElement('div');
	correctAnswerContainer.id = 'questionCorrectAnswerChartContainer';
	correctAnswerContainer.classList.add('mb-3');
	correctAnswerContainer.classList.add('col-12');

	const chartHugeCanvas = document.createElement('canvas');
	chartHugeCanvas.id = 'questionMainStat';

	correctAnswerContainer.appendChild(chartHugeCanvas);

	statContainer.appendChild(mainStat);
	statContainer.appendChild(canvasRow);
	statContainer.appendChild(correctAnswerContainer);

	initialiceQuestionsCharts(serverData.validationCounter);
}

function setGeneralStadistics(serverData){
	const generalStadisticsContainer = $("#generalStadistics")[0];
	const mainStatContainer1 = document.createElement('div');
	mainStatContainer1.id = 'mainStat1';
	mainStatContainer1.classList.add('d-flex');
	mainStatContainer1.classList.add('justify-content-center');
	mainStatContainer1.classList.add('align-items-center');
	mainStatContainer1.classList.add('flex-column');
	mainStatContainer1.classList.add('col-12');
	mainStatContainer1.classList.add('col-md-6');

	const responseStatTitle = document.createElement('span');
	responseStatTitle.classList.add('statTitle');
	responseStatTitle.innerHTML = 'Respuestas obtenidas';

	const responseStatCounter = document.createElement('span');
	responseStatCounter.id = 'responsesCounter';
	responseStatCounter.classList.add('statResult');
	responseStatCounter.innerHTML = serverData.responsesCounter;

	mainStatContainer1.appendChild(responseStatTitle);
	mainStatContainer1.appendChild(responseStatCounter);

	const mainStatContainer2 = document.createElement('div');
	mainStatContainer2.classList.add('col-12');
	mainStatContainer2.classList.add('col-md-6');
	mainStatContainer2.classList.add('d-flex');
	mainStatContainer2.classList.add('justify-content-center');
	mainStatContainer2.classList.add('align-items-center');
	mainStatContainer2.classList.add('flex-column');

	const mainStat2Container = document.createElement('div');
	mainStat2Container.id = 'mainStat2Container';

	const chartCanvas = document.createElement('canvas');
	chartCanvas.id = 'mainStat2';

	mainStat2Container.appendChild(chartCanvas);
	mainStatContainer2.appendChild(mainStat2Container);

	generalStadisticsContainer.appendChild(mainStatContainer1);
	generalStadisticsContainer.appendChild(mainStatContainer2);

	initialiceUsersChart(serverData.typeUserCounter);
}

function initialiceQuestionsCharts(serverData){
	const serverDataResume = resumeServerData(serverData);
	const sortServerData = serverData.sort((a, b) => a.order - b.order);
	console.log("aa");
	console.log(sortServerData)
	// Set donut chart
	const data = {
		labels: [
		'Correctas',
		'Incorrectas',
		'Sin contestar'
		],
		datasets: [{
		label: 'My First Dataset',
		data: [serverDataResume.correct, serverDataResume.incorrect, serverDataResume.empty],
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
					display: true,
					text: 'Respuestas'
				}
			}
		}
	};
	const ctx = document.getElementById('questionStat');
	new Chart(ctx, config);

	// Set bar chart
	const labels = getArrayLabels(sortServerData);
	const array_data = getArrayCorrects(sortServerData);
	const bar_data = {
        labels: labels,
        datasets: [{
          label: 'My First Dataset',
          data: array_data,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
			'rgba(255, 99, 132, 0.2)',
			'rgba(255, 159, 64, 0.2)',
			'rgba(255, 205, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(201, 203, 207, 0.2)',
			'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 4
        }]
      };
      const bar_config = {
        type: 'bar',
        data: bar_data,
		options: {
			responsive:true,
			maintainAspectRatio:false,
			scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                }
            },
			plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Respuestas correctas por pregunta',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font: {
                        size: 14,
                        weight: 'bolder'
                    }
                }
            },
		}
      };
    const barChart = document.getElementById('questionMainStat');
	new Chart(barChart, bar_config);
	console.log(serverDataResume);
}

function getArrayLabels(arr){
	const orderArray = [];
	for(let ar of arr){
		orderArray.push(ar.order);
	}
	return orderArray;
}

function getArrayCorrects(arr){
	const correctArray = [];
	for(let ar of arr){
		correctArray.push(ar.correct);
	}
	return correctArray
}

function resumeServerData(serverData){
	const resume = {
		correct: 0,
		incorrect: 0,
		empty: 0
	}
	for(let response of serverData){
		resume.correct += response.correct;
		resume.incorrect += response.incorrect;
		resume.empty += response.empty;
	}
	return resume;
}

function initialiceUsersChart(serverData){
	const data = {
        labels: [
          'Registrados',
          'Invitados'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [serverData.register, serverData.guest],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
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
                    display: true,
                    text: 'Tipo de usuario'
                }
            }
        }
      };
    const ctx = document.getElementById('mainStat2');

  	new Chart(ctx, config);
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
	let animation2 = bodymovin.loadAnimation({
        container: document.getElementById('loadingAnimation2'),
        path: '/static/lottie/loading.json',
        render: 'svg',
        loop: true,
        autoplay: true,
        name: 'animation name'
    })
}

function setUserTypesChart(){
	const data = {
        labels: [
          'Registrados',
          'Invitados'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [8, 2],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
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
                    display: true,
                    text: 'Tipo de usuario'
                }
            }
        }
      };
    const ctx = document.getElementById('mainStat2');

  	new Chart(ctx, config);
}

function setCorrectAnswersByQuestionChart(){
	const data = {
        labels: [
          '1',
          '2',
		  '3',
		  '4',
		  '5',
		  '6',
		  '7',
		  '8',
		  '9',
		  '10'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [8, 2, 3,4,1,3,7,8,1,0],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
			'rgba(255, 99, 132, 0.2)',
			'rgba(255, 159, 64, 0.2)',
			'rgba(255, 205, 86, 0.2)',
			'rgba(75, 192, 192, 0.2)',
			'rgba(54, 162, 235, 0.2)',
			'rgba(153, 102, 255, 0.2)',
			'rgba(201, 203, 207, 0.2)',
			'rgb(255, 99, 132)',
            'rgb(54, 162, 235)'
          ],
          hoverOffset: 4
        }]
      };
      const config = {
        type: 'bar',
        data: data,
		options: {
			responsive:true,
			maintainAspectRatio:false,
			scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    display: false,
                }
            },
			plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Respuestas correctas por pregunta',
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    font: {
                        size: 14,
                        weight: 'bolder'
                    }
                }
            },
		}
      };
    const ctx = document.getElementById('questionMainStat');
	new Chart(ctx, config);
}

function setQuestionStats(){
	const data = {
		labels: [
		'Correctas',
		'Incorrectas',
		'Sin contestar'
		],
		datasets: [{
		label: 'My First Dataset',
		data: [8, 4, 3],
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
					display: true,
					text: 'Tipo de usuario'
				}
			}
		}
	};
	const ctx = document.getElementById('questionStat');

	new Chart(ctx, config);
}