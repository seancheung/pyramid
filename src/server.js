const app = require('./app');
const debug = require('debug')('pyramid:server');
const http = require('http');
const config = app.get('config');

/**
 * create HTTP server
 */
const server = http.createServer(app);

/**
 * listen on provided port, on all network interfaces.
 */
server.listen(config.port, config.host);
server.on('error', onError);
server.on('listening', onListening);

/**
 * event listener for HTTP server "error" event
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind =
        typeof config.port === 'string'
            ? 'Pipe ' + config.port
            : 'Port ' + config.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
        debug(bind + ' requires elevated privileges');
        process.exit(1);
        break;
    case 'EADDRINUSE':
        debug(bind + ' is already in use');
        process.exit(1);
        break;
    default:
        throw error;
    }
}

/**
 * event listener for HTTP server "listening" event
 */

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = server;
