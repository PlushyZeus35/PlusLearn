init();

let animation2 = bodymovin.loadAnimation({
    container: document.getElementById('ghostAnimation'),
    path: '/static/lottie/noDataGhost.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})

let loadingAnimation = bodymovin.loadAnimation({
  container: document.getElementById('loadingAnimation'),
  path: '/static/lottie/loading.json',
  render: 'svg',
  loop: true,
  autoplay: true,
  name: 'animation name'
})

function handleOnClickTest(id){
	window.location.href = '/test/s/' + id; //relative to domain
}

function init(){
	getLimitTestsData();
}

function getLimitTestsData(){
	axios.get('/test/g/getUserTests')
        .then(function (response) {
			if(response.data.error){
                window.location.href = "/error";
            }
			if(response.data.tests.length>0){
				displayTests(response.data);
			}else{
				showEmptyTestContainer();
			}
			
        })
        .catch(function (error) {
            window.location.href = "/error";
        });
}

function showEmptyTestContainer(){
	hideLoader();
	const noDataContainer = $("#noDataContainer")[0];
	noDataContainer.classList.remove('d-none');
	let animation = bodymovin.loadAnimation({
		container: document.getElementById('noDataAnimation'),
		path: '/static/lottie/noData.json',
		render: 'svg',
		loop: true,
		autoplay: true,
		name: 'animation name'
	})
}

function displayTests(serverData){
	hideLoader();
	const testContainer = $("#cardListContainer")[0];
	for(let test of serverData.tests){
		console.log(test)
		let col = document.createElement('div');
		col.classList.add('col-12');
		col.classList.add('col-md-6');
		col.classList.add('pb-3');

		let card = document.createElement('div');
		card.classList.add('card');
		card.classList.add('h-100');

		let cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
		cardBody.classList.add('d-flex');
		cardBody.classList.add('flex-column');
		cardBody.classList.add('justify-content-between')

		let testTitle = document.createElement('h5');
		testTitle.classList.add('card-title');
		testTitle.innerHTML = test.title;

		let testDescription = document.createElement('p');
		testDescription.classList.add('card-text');
		testDescription.innerHTML = test.description;

		let testInfo = document.createElement('div');
		testInfo.classList.add('mb-2');
		testInfo.appendChild(testTitle);
		testInfo.appendChild(testDescription);

		let testLink = document.createElement('a');
		testLink.classList.add('btn');
		testLink.classList.add('btn-outline-secondary');
		testLink.classList.add('me-3');
		testLink.href = '/test/stats/' + test.id;
		testLink.innerHTML = 'Configurar';

		let accessLink = document.createElement('a');
		accessLink.classList.add('btn');
		accessLink.classList.add('btn-primary');
		accessLink.href = '/test/d/' + test.interactiveCode;
		accessLink.innerHTML = 'Acceder';

		let linkContainer = document.createElement('div');
		linkContainer.appendChild(testLink);
		linkContainer.appendChild(accessLink);

		let cardFooter = document.createElement('div');
		cardFooter.classList.add('card-footer');
		cardFooter.classList.add('text-body-secondary');
		cardFooter.classList.add('text-center');
		cardFooter.innerHTML = 'Modificado: ' + test.timeStamp;

		cardBody.appendChild(testInfo);
		cardBody.appendChild(linkContainer);

		card.appendChild(cardBody);
		card.appendChild(cardFooter);

		col.appendChild(card);
		testContainer.appendChild(col);
	}
	if(serverData.showMoreLink){
		const showMoreContainer = document.createElement('div');
		showMoreContainer.classList.add('d-flex');
		showMoreContainer.classList.add('justify-content-center');
		const showMoreLink = document.createElement('a');
		showMoreLink.innerHTML = 'Mostrar más'
		showMoreLink.classList.add('text-center');
		showMoreLink.href = '#';
		showMoreLink.onclick = showAllTestList;
		testContainer.appendChild(showMoreContainer);
		showMoreContainer.appendChild(showMoreLink)
	}
}

function showAllTestList(){
	hideTests();
	showLoader();
	getUserTests();
}

function hideTests(){
	$("#cardListContainer")[0].innerHTML = '';
}

function showLoader(){
	const loadingContainer = $("#loadingContainer")[0];
	const loadingCanvas = document.createElement('div');
	loadingCanvas.id = 'loadingAnimation';
	loadingContainer.appendChild(loadingCanvas);
	let animtaion = bodymovin.loadAnimation({
		container: document.getElementById('loadingAnimation'),
		path: '/static/lottie/loading.json',
		render: 'svg',
		loop: true,
		autoplay: true,
		name: 'animation name'
	})
	let loadingTitle = document.createElement('h2') //h2.ubuntuFont Cargando datos...
	loadingTitle.classList.add('ubuntuFont');
	loadingTitle.innerHTML = 'Cargando datos...';
	loadingContainer.appendChild(loadingTitle);
}

function hideLoader(){
	$("#loadingContainer")[0].innerHTML = '';
}

function getUserTests(){
	axios.get('/test/all/getUserTests')
        .then(function (response) {
			if(response.data.error){
                window.location.href = "/error";
            }
			console.log(response.data);
			displayTableTests(response.data);
        })
        .catch(function (error) {
            window.location.href = "/error";
        });
}

function displayTableTests(serverData){
	hideLoader();
	const testContainer = $("#cardListContainer")[0];
	let table = document.createElement('table');
	table.classList.add('table');
	table.classList.add('table-dark');
	table.classList.add('table-hover');

	// Contruct table header
	let tHead = document.createElement('thead');
	let tHeadTr = document.createElement('tr');
	let titleTh = document.createElement('th');
	titleTh.innerHTML = 'Título';
	let dateTh = document.createElement('th');
	dateTh.innerHTML = 'Modificado';
	tHeadTr.appendChild(titleTh);
	tHeadTr.appendChild(dateTh);
	tHead.appendChild(tHeadTr);
	table.appendChild(tHead);

	// Contruct table body
	let tBody = document.createElement('tbody');
	for(let test of serverData.tests){
		let tBodyTr = document.createElement('tr');
		tBodyTr.classList.add('pointer');
		tBodyTr.onclick = testClicked;
		tBodyTr.id = test.id;
		let titleTh = document.createElement('td');
		titleTh.innerHTML = test.title;
		let dateTh = document.createElement('td');
		dateTh.innerHTML = test.timeStamp;
		tBodyTr.appendChild(titleTh);
		tBodyTr.appendChild(dateTh);
		tBody.appendChild(tBodyTr);
	}
	table.appendChild(tBody);

	// Insert table
	testContainer.appendChild(table);
}

function testClicked(){
	console.log("click " + this.id);
	handleOnClickTest(this.id);
}