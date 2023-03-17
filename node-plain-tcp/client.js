
const net = require('net');

// create new client socket
const client = new net.Socket();

// Constants
const SERVER = process.env.SERVER || "127.0.0.1";

// Use created client to connect to server:
client.connect(9233, SERVER, (error) => {
    console.log('Connected to packet feed');

    // send all 3 seconds a request:
    var interval = setInterval(function () {
        console.log("send message to server...")
        // actual sending data to server with write:
        client.write('Hello, super server! Love, Client.');
    }, 3000);
});

// Define what should happen, if data is received:
client.on('data', function (data) {
    // Print out data:
    console.log('Received: ' + data);
    //client.destroy(); // kill client after server's response
});

// Define what should happen, if there is an error:
client.on('error', (err) => {
    // Print out error:
    console.log(err);
})
