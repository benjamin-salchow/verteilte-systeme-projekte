const axios = require('axios')

// Constants
const SERVER = process.env.SERVER || "localhost";

function postRandomNumberToServer() {
    // Use of defined client entry point as POST!
    axios.post(`http://${SERVER}:8080/client_post`, {
        // definition of actual content that should be sned with post as JSON
        post_content: 'Random Number: ' + Math.random()
    })
        .then((res) => {
            // This is executed if the server returns an answer:
            // Status code represents: https://de.wikipedia.org/wiki/HTTP-Statuscode
            console.log(`statusCode: ${res.status}`)
            // Print out actual data:
            console.log(res.data)
        })
        .catch((error) => {
            // This is executed if there is an error:
            console.error(error)
        })
}

// Start with a request:
postRandomNumberToServer()
// send all 3 seconds a request:
var interval = setInterval(function () {
    postRandomNumberToServer()
}, 3000);