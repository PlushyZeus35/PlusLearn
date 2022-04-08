const express = require('express');
const path = require('path')
const favicon = require('serve-favicon');
var indexRouter = require('./routes/index');

const app = express();

// Middlewares
const myLogger = function (req, res, next) {
    console.log('LOGGED');
    next();
}

// Set default favicon
app.use(favicon(path.join(__dirname, 'public', 'assets', 'images', 'brand', 'favicon.ico')));

// Set static path to serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Set Pug Template Engine
// Set directory where the template files are located
app.set('views', './views');
// Set template engine to use
app.set('view engine', 'pug');

// Set middlewares
// app.use(myLogger);

// Usamos el routing index (./routes/index)
app.use('/', indexRouter);

module.exports = app;