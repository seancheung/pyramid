const express = require('express');
const morgan = require('morgan');
const config = require('config');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const debug = require('debug')(`${config.app.tag}:app`);

const app = express();

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
    if (!err.status || !/^4/.test(err.status)) debug(err);
});

module.exports = app;
