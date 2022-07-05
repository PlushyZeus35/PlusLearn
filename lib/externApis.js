const axios = require('axios');


const externApis = {};

externApis.getTrivialQuestions = async () => {
    const URL = 'https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple';
    axios.get(URL)
        .then(function (response) {
            // handle success
            if(response.data.response_code == 0)
                console.log(response.data.results);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
}

module.exports = externApis;

// Make a request for a user with a given ID

