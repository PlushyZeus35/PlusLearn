Chart.defaults.color = '#fff';

function showResponsesDataChart(){
  
  for(i=0; i < responsesLabels.length; i++){
    responsesLabels[i] = responsesLabels[i].split('T')[0];
  }

  responsesLabels.reverse();
  responsesData.reverse();
  newUsersData.reverse();

  const data = {
    labels: responsesLabels,
    datasets: [{
      label: 'New Responses',
      data: responsesData,
      fill: true,
      borderColor:[
        'rgba(128, 128, 255, 1)'
      ],
      backgroundColor: [
        'rgba(128, 128, 255, 0.3)'
      ],
      tension: 0.1
    },
    {
      label: 'New Responses',
      data: newUsersData,
      fill: true,
      borderColor:[
        'rgba(112, 55, 112, 1)'
      ],
      backgroundColor: [
        'rgba(112, 55, 112, 0.3)'
      ],
      tension: 0.1
    }]

  };

  const config = {
    type: 'line',
    data: data,
  };

  const responsesCanvas = $('#responseChart')[0].getContext('2d');
  const responseChart = new Chart(responsesCanvas, config);
}

function showUserDataChart(){
  const data = {
      labels: [
        'Regular',
        'Admins'
      ],
      datasets: [{
        label: 'Admins / Regulars Users',
        data: usersData,
        borderColor:[
          'rgba(112, 55, 112, 1)',
          'rgba(128, 128, 255, 1)'
        ],
        backgroundColor: [
          'rgba(112, 55, 112, 0.3)',
          'rgba(128, 128, 255, 0.3)'
        ],
        hoverOffset: 4
      }]
  };

  const options = {
      plugins: {
          legend: {
              position: 'left'
          },
          title: {
              display: true,
              text: 'Admins / Regulars Users'
          }
      }
  }

  const config = {
      type: 'doughnut',
      data: data,
      options: options
  };
  let userCanvas = $('#userChart')[0];
  const userChart = new Chart(userCanvas, config);

}



showUserDataChart();
showResponsesDataChart()
