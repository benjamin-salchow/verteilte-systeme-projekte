'use strict';

// Load dependencies
const express = require('express');
const { ExpressPeerServer } = require('peer');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Create express base app
const app = express();

// Entrypoint - call it with: http://localhost:8080/ -> redirect you to http://localhost:8080/static
app.get('/', (req, res) => {
  console.log("Got a request and redirect it to the static index page");
  // redirect will send the client to another path / route. In this case to the static route.
  res.redirect('/static');
});

// All requests to /static/... will be reidrected to static files in the folder "public"
// call it with: http://localhost:8080/static
app.use('/static', express.static('public'))

// Start the actual server
const server = app.listen(PORT, HOST);

// Create PeerJS Server
const peerServer = ExpressPeerServer(server, {
  path: '/myapp',
  proxied: true,
  // iceServers:    [{ 'urls': ['stun:stun.l.google.com:19302'] }]
});

// Link created PeerJS Server to the express app
app.use('/peerjs', peerServer);

// Print out some information after start of the server
console.log(`Running on http://${HOST}:${PORT}`);
console.log(`Open the following URL with your Browser: http://localhost:${PORT}/`);


// ==== events of peerjs =====
// Connection event - triggers when a client connect
peerServer.on('connection', (client) => { console.log("client connected: ", client) });
// Dissconection event - triggers when a client disconnects
peerServer.on('disconnect', (client) => { console.log("client disconnected: ", client) });