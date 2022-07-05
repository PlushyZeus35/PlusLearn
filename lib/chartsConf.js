const databaseHelper = require('./databaseHelper');
const chartsConf = {};


chartsConf.getDoughnutUser = async () => {

    const regularUser = await databaseHelper.howManyUsers();
    const adminUser = await databaseHelper.howManyAdmins();
    const users = [regularUser, adminUser];
    
    const data = {
        labels: [
          'Regular',
          'Admins'
        ],
        datasets: [{
          label: 'Admins / Regulars Users',
          data: users,
          backgroundColor: [
            'rgb(255, 153, 102)',
            'rgb(128, 128, 255)'
          ],
          hoverOffset: 4
        }]
    };

    const config = {
        type: 'doughnut',
        data: data,
    };

    return config;

}

module.exports = chartsConf;