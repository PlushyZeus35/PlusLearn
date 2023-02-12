const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./models/index');
const flash = require('connect-flash');
var session = require('express-session');

// INITIALIZATIONS
const app = express();
sequelize.sync( {force: false }).then(async () => {
    console.log("Conectado a la base de datos!");
}).catch(error => {
    console.log("Se ha producido un error!", error);
}); 
app.use(bodyParser.urlencoded({ extended: true }));
require('./models/associations')

// SETTINGS
// Set static path to serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());

// TEMPLATE ENGINE
// Set Pug Template Engine
// Set directory where the template files are located
app.set('views', './views');
// Set template engine to use
app.set('view engine', 'pug');

// MIDDLEWARES

// GLOBAL VARIABLES
app.use((req,res,next) => {
    res.locals.messages = req.flash("Message");
    res.locals.successes = req.flash("Success");
    app.locals.user = req.user;
    next();
});

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/index'));
app.use('/auth',require('./routes/auth'));


module.exports = app;