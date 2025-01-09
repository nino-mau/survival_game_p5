/** Equivalent to import */
const http = require('http');
const app = require('./app');
const { Server } = require("socket.io");

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
  

/** --- Configure the server --- */

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});


/** --- Handle socket.io related functions --- */

/** Log new connections */
const io = new Server(server);

io.on('connection', (socket) => {
    console.log(`Socket ID ${socket.id} connected`);
    socket.on('disconnect', () => {
        console.log(`Socket ID ${socket.id} disconnected`);
    });
});

/** Receive player position */
io.on('connection', (socket) => {
    socket.on('playerPosition', (arg1, arg2, callback) => {
        let playerPosition = {playerId: socket.id, posX: arg1, posY: arg2};
        console.log(playerPosition);
        callback({
            status: 'Position received'
        });
    });
});


/** --- Start the server --- */
server.listen(port);
