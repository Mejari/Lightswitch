var iojs = require('socket.io');
var http = require('http');

var io;

module.exports = function (app) {
    if (io) {
        return io;
    }
    var server = http.createServer(app);
    io = iojs(server);

    server.listen(4200);

    return io;
};