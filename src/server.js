const app = require('./app');
const config = require('config');
const debug = require('debug')(`${config.app.tag}:server`);
const http = require('http');

app.set('port', config.app.port);
app.set('host', config.app.host);

/**
 * create HTTP server
 */
const server = http.createServer(app);

/**
 * listen on provided port, on all network interfaces.
 */
server.listen(config.app.port, config.app.host);
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
        typeof config.app.port === 'string'
            ? 'Pipe ' + config.app.port
            : 'Port ' + config.app.port;

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
