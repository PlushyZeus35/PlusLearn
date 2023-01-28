const express = require('express');
const path = require('path')
const sequelize = require('./models/index');

// INITIALIZATIONS
const app = express();
sequelize.sync( {force: false }).then(async () => {
    console.log("Conectado a la base de datos!");
}).catch(error => {
    console.log("Se ha producido un error!", error);
}); 

// SETTINGS
// Set static path to serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// TEMPLATE ENGINE

// MIDDLEWARES

// GLOBAL VARIABLES

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/index'));


module.exports = app;