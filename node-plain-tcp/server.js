const net = require('net');

// Create actual server with Socket
const server = net.createServer((socket) => {
    // Server sends welcome message to client, if someone connects:
    socket.write('Hello there, client\r\n');

    // Define what should happen, if data is received:
    socket.on('data', function (data) {
        //console.log(data);
        // transform data to utf8 string
        textChunk = data.toString('utf8');
        // Print out the received and transformed data:
        console.log("Received: " + textChunk);

        console.log("Answer to client...")
        // Send answer back to client:
        socket.write("Hello back");
    });

    // Send message back to all other nodes...
    //socket.pipe(socket);
});

console.log("Server is ready...")
// Defines the TCP port which should be used:
server.listen(9233, '0.0.0.0');
// IP: 0.0.0.0 means to listen on all interfaces!
