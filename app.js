const express = require('express');
const path = require('path')
const favicon = require('serve-favicon');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const { database } = require('./models/keys');
const passport = require('passport');


// INITIALIZATIONS
const app = express();
require('./lib/passport');

// SETTINGS
// Set static path to serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));
// Set default favicon
app.use(favicon(path.join(__dirname, 'public', 'assets', 'images', 'brand', 'favicon.ico')));
// Set Pug Template Engine
// Set directory where the template files are located
app.set('views', './views');
// Set template engine to use
app.set('view engine', 'pug');

// MIDDLEWARES
app.use(session({
    secret: 'pluslearnsession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// GLOBAL VARIABLES
app.use((req,res,next) => {
    res.locals.messages = req.flash("message");
    res.locals.successes = req.flash("success");
    app.locals.user = req.user;
    next();
});

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/index'));
app.use('/authentication', require('./routes/authentication'));
app.use(require('./routes/profiles'));

module.exports = app;