const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const debug = require('debug')('pyramid:app');
const path = require('path');
const config = require('./config');
const init = path.join(__dirname, `../${config.init}`);
const fs = require('fs');

const app = express();

/**
 * Config
 */
app.set('config', config);

/**
 * init
 */
if (fs.existsSync(init)) {
    const db = require('./db/boot')(require(init));
    app.set('db', db);
}

/**
 * set request logger
 */
app.use(morgan('dev', { stream: { write: debug } }));

/**
 * body parser
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * cookie parser
 */
app.use(cookieParser());

/**
 * static files
 */
app.use('/', express.static(path.join(__dirname, '../public')));

/**
 * router
 */
app.use(require('./routes'));

/**
 * Renderer
 */
require('./renderer')(app);

/**
 * catch 404 and forward to error handler
 */
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/**
 * error handler
 */
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.status = err.status || 500;
    if (req.app.get('env') === 'development') {
        res.locals.stack = err.stack;
    }

    // set http status
    res.status(err.status || 500);

    // handle ajax request
    if (req.xhr || /json/i.test(req.headers.accept)) {
        res.json({
            error: err.status || 500,
            message: err.message
        });
    } else {
        //generic error
        res.render('error');
    }

    // bypass 4xx errors
    if (!err.status || !/^4[0-9]{2}/.test(err.status)) debug(err);
});

module.exports = app;
