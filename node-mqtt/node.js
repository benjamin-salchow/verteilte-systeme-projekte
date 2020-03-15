var os = require("os");
var mqtt = require('mqtt')

// defines the client and the server address
var client = mqtt.connect('mqtt://mqttserver')


// Constants
const NODENAME = process.env.NODENAME || "node1";
const HOSTNAME = os.hostname();
console.log("Starting Node: " + NODENAME + " - hostname:" + HOSTNAME);

// generate a random number min ... max
function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * Math.floor(max - min));
}

// post a message through mqtt
function postMessage() {
  console.log("Sending message...")
  // the publish function will send the message to the defined topic
  client.publish('mytopic', 'My message: ' + Math.random() + ' - from node:' + HOSTNAME)
}

// start the connection
client.on('connect', function () {
  // subscribe to a topic to receive message from it
  client.subscribe('mytopic', function (err) {
    if (!err) {
      // after connection is success - send hello:
      client.publish('mytopic', 'Hello mqtt from Node:' + HOSTNAME)
      // send all 2..5 seconds a message:
      var interval = setInterval(function () {
        // send a message...
        postMessage()
      }, getRandomInt(2000,5000));
    }
  })
})

// What should happen if I recive a message?
client.on('message', function (topic, message) {
  // message is Buffer
  console.log("Received:" + message.toString())
  // to end the connection:
  //client.end()
})