/*console.log("aa")
let charts = $(".testChart");
console.log(charts[0]);

for(let i; i<charts.length; i++){
	let chart = charts[i]
	console.log(chart)
	let eChart = new Chart(chart, {
		type: 'doughnut',
		data: {
		  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
		  datasets: [{
			data: [12, 19, 3, 5, 2, 3]
		  }]
		},
		options: {
			plugins: {
				legend: {
					display: false
				}
			}
		}
	  });
	  console.log(eChart)
}*/

let animation = bodymovin.loadAnimation({
    container: document.getElementById('noDataAnimation'),
    path: '/static/lottie/noData.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})

let animation2 = bodymovin.loadAnimation({
    container: document.getElementById('ghostAnimation'),
    path: '/static/lottie/noDataGhost.json',
    render: 'svg',
    loop: true,
    autoplay: true,
    name: 'animation name'
})

const ctx = document.getElementById('genChart');

new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        data: [12, 19, 3, 5, 2, 3]
      }]
    },
    options: {
        plugins: {
            legend: {
                display: false
            }
        }
    }
  });

function handleOnClickTest(id){
	window.location.href = '/test/s/' + id; //relative to domain
}