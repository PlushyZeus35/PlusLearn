const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sequelize = require('./models/index');
const { database} = require('./config');
const MariaDBStore = require('express-session-mariadb-store');
require('./models/associations');
const passport = require('passport');
const flash = require('connect-flash');
var session = require('express-session');
const emailController = require('./helpers/emailController');

// INITIALIZATIONS
const app = express();
sequelize.sync( {force: false }).then(async () => {
    console.log("Conectado a la base de datos!");
}).catch(error => {
    console.log("Se ha producido un error!", error);
    emailController.sendErrorEmail(error);
}); 
require('./helpers/identification');

// SETTINGS
// Set static path to serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ 
    extended: true 
}));


// TEMPLATE ENGINE
// Set Pug Template Engine
// Set directory where the template files are located
app.set('views', './views');
// Set template engine to use
app.set('view engine', 'pug');

// MIDDLEWARES
app.use(session({ 
    cookie: { 
        maxAge: 6000000 
    }, 
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false,
    store: new MariaDBStore(database)
}));
app.use(flash());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/test',require('./routes/test'));


module.exports = app;