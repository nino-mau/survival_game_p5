/** Equivalent to import */
const http = require('http');
const app = require('./app');

/** Convert string/int port to valid port */
const normalizePort = val => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

/** Set the port */
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

/** Handle errors */
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
  
/** --- Handle socket.io related functions --- */

/** Track users and log them */
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


/** --- Configure and start the server --- */

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
