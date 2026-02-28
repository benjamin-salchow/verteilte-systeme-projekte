'use strict';

const express = require('express');

// Database
const mysql = require('mysql');
// Database connection info - used from environment variables
var dbInfo = {
    connectionLimit : 10,
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

var connection = mysql.createPool(dbInfo);
console.log("Conecting to database...");
// connection.connect(); <- connect not required in connection pool

// SQL Database init.
// In this current demo, this is done by the "database.sql" file which is stored in the "db"-container (./db/).
// Alternative you could use the mariadb basic sample and do the following steps here:
/*
connection.query("CREATE TABLE IF NOT EXISTS table1 (task_id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)  ENGINE=INNODB;", function (error, results, fields) {
    if (error) throw error;
    console.log('Answer: ', results);
});
*/
// See readme.md for more information about that.

// Check the connection
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error; // <- this will throw the error and exit normally
    // check the solution - should be 2
    if (results[0].solution == 2) {
        // everything is fine with the database
        console.log("Database connected and works");
    } else {
        // connection is not fine - please check
        console.error("There is something wrong with your database connection! Please check");
        process.exit(5); // <- exit application with error code e.g. 5
    }
});


// Constants
const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// App
const app = express();

// Features for JSON Body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// -------------------------- RATE LIMITER (BEGINNER NOTES) --------------------------
// Why this exists:
// A rate limiter protects endpoints from "too many requests in a very short time".
// This can happen by accident (e.g., button spam, buggy loop) or on purpose (abuse).
//
// How this implementation works:
// 1) For each client IP address, we store a small "bucket" object in memory.
// 2) A bucket has:
//    - count: how many requests arrived in the current time window
//    - resetAt: timestamp when the current window ends
// 3) If the window is over, count is reset to 0 and a new window starts.
// 4) If count goes above maxRequests, we return HTTP 429 ("Too Many Requests").
//
// Important: this is an in-memory demo limiter (simple and good for teaching).
// For production/multi-server setups, use shared storage (e.g., Redis).
const dbRateBuckets = new Map();
function dbRateLimit(req, res, next) {
    // Window length in milliseconds (default: 10 seconds).
    // You can override this via environment variable RATE_LIMIT_WINDOW_MS.
    const windowMs = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "10000", 10); // 10s
    // Maximum allowed requests within one window (default: 120 requests).
    // You can override this via environment variable RATE_LIMIT_MAX.
    const maxRequests = Number.parseInt(process.env.RATE_LIMIT_MAX || "120", 10); // 120 req / 10s
    const now = Date.now();
    // Identify the caller. Usually req.ip is enough in Express.
    const key = req.ip || req.socket.remoteAddress || "unknown";

    // Load existing bucket for this IP or create a fresh one.
    const bucket = dbRateBuckets.get(key) || { count: 0, resetAt: now + windowMs };
    // If the time window is over, start a new window.
    if (now > bucket.resetAt) {
        bucket.count = 0;
        bucket.resetAt = now + windowMs;
    }

    // Count this request.
    bucket.count += 1;
    dbRateBuckets.set(key, bucket);

    // If the client exceeded the limit, tell them when to retry.
    if (bucket.count > maxRequests) {
        // Remaining wait time, rounded up to full seconds.
        const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
        // Standard header used by clients/tools to know wait time.
        res.set("Retry-After", String(retryAfterSeconds));
        return res.status(429).json({
            message: "Too many requests. Please retry soon.",
            retry_after_seconds: retryAfterSeconds
        });
    }

    // Periodic cleanup: remove old/expired buckets so memory does not grow forever.
    if (dbRateBuckets.size > 1000) {
        for (const [ip, state] of dbRateBuckets.entries()) {
            if (now > state.resetAt) {
                dbRateBuckets.delete(ip);
            }
        }
    }

    // Limit not exceeded -> continue to the actual route handler.
    next();
}

// Entrypoint - call it with: http://localhost:8080/ -> redirect you to http://localhost:8080/static
app.get('/', (req, res) => {
    console.log("Got a request and redirect it to the static page");
    // redirect will send the client to another path / route. In this case to the static route.
    res.redirect('/static');
});

// Another GET Path - call it with: http://localhost:8080/special_path
app.get('/special_path', (req, res) => {
    res.send('This is another path');
});

// Another GET Path that shows the actual Request (req) Headers - call it with: http://localhost:8080/request_info
app.get('/request_info', (req, res) => {
    console.log("Request content:", req)
    res.send('This is all I got from the request:' + JSON.stringify(req.headers));
});

// POST Path - call it with: POST http://localhost:8080/client_post
app.post('/client_post', (req, res) => {
    if (typeof req.body !== "undefined" && typeof req.body.post_content !== "undefined") {
        var post_content = req.body.post_content;
        console.log("Client send 'post_content' with content:", post_content)
        // Set HTTP Status -> 200 is okay -> and send message
        res.status(200).json({ message: 'I got your message: ' + post_content });
    }
    else {
        // There is no body and post_contend
        console.error("Client send no 'post_content'")
        // Set HTTP Status -> 400 is client error -> and send message
        res.status(400).json({ message: 'This function requries a body with "post_content"' });
    }
});

// ###################### BUTTON EXAMPLE ######################
// POST path for Button 1
app.post('/button1_name', (req, res) => {
    // Load the name from the formular. This is the ID of the input:
    const name = req.body.name
    // Print it out in console:
    console.log("Client send the following name: " + name + " | Button1")
    // Send JSON message back - this could be also HTML instead.
    res.status(200).json({ message: 'I got your message - Name is: ' + name });
    // More information here: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/forms
})

// GET path for Button 2
app.get('/button2', (req, res) => {
    // This will generate a random number and send it back:
    const random_number = Math.random();
    // Print it out in console:
    console.log("Send the following random number to the client: " + random_number + " | Button2")
    // Send it to the client / webbrowser:
    res.send("Antwort: " + random_number);
    // Instead of plain TXT - the answer could be a JSON
    // More information here: https://www.w3schools.com/xml/ajax_intro.asp
});
// ###################### BUTTON EXAMPLE END ######################


// ###################### DATABASE PART ######################
// GET path for database
app.get('/database', dbRateLimit, (req, res) => {
    console.log("Request to load all entries from table1");
    // Prepare the get query
    connection.query("SELECT * FROM `table1`;", function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Database query failed" });
        } else {
            // we got no error - send it to the client
            console.log('Success answer from DB: ', results); // <- log results in console
            // INFO: Here could be some code to modify the result
            res.status(200).json(results); // <- send it to client
        }
    });
});

// DELETE path for database
app.delete('/database/:id', dbRateLimit, (req, res) => {
    // This path will delete an entry. For example the path would look like DELETE '/database/5' -> This will delete number 5
    let id = Number.parseInt(req.params.id, 10); // <- load and validate the ID from the path
    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid id" });
    }
    console.log("Request to delete Item: " + id); // <- log for debugging

    // Use a parameterized query to prevent SQL injection.
    connection.query("DELETE FROM `table1` WHERE `table1`.`task_id` = ?;", [id], function (error, results, fields) {
        if (error) {
            console.error(error);
            res.status(500).json({ message: "Delete failed" });
        } else {
            // Everything is fine with the query
            console.log('Success answer: ', results); // <- log results in console
            res.status(200).json({ message: "Deleted" });
        }
    });
});

// POST path for database
app.post('/database', dbRateLimit, (req, res) => {
    // This will add a new row. So we're getting a JSON from the webbrowser which needs to be checked for correctness and later
    // it will be added to the database with a query.
    if (typeof req.body !== "undefined" && typeof req.body.title !== "undefined" && typeof req.body.description !== "undefined") {
        // The content looks good, so move on
        // Get the content to local variables:
        var title = req.body.title;
        var description = req.body.description;
        console.log("Client send database insert request with 'title': " + title + " ; description: " + description); // <- log to server
        // Use placeholders to avoid SQL injection.
        connection.query(
            "INSERT INTO `table1` (`task_id`, `title`, `description`, `created_at`) VALUES (NULL, ?, ?, current_timestamp());",
            [title, description],
            function (error, results, fields) {
            if (error) {
                console.error(error);
                res.status(500).json({ message: "Insert failed" });
            } else {
                // Everything is fine with the query
                console.log('Success answer: ', results); // <- log results in console
                res.status(200).json({ message: "Inserted" });
            }
        });
    }
    else {
        // There is nobody with a title nor description
        console.error("Client send no correct data!")
        // Set HTTP Status -> 400 is client error -> and send message
        res.status(400).json({ message: 'This function requries a body with "title" and "description' });
    }
});
// ###################### DATABASE PART END ######################




// All requests to /static/... will be redirected to static files in the folder "public"
// call it with: http://localhost:8080/static
app.use('/static', express.static('public'))

// Start the actual server
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

// Start database connection
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}




