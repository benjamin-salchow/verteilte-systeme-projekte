<?php
// Get all required DB information from environment variables
$servername = $_ENV["MYSQL_HOSTNAME"];
$username = $_ENV["MYSQL_USER"];
$password = $_ENV["MYSQL_PASSWORD"];
$dbname = $_ENV["MYSQL_DATABASE"];

// Create connection
/// --- Doku: https://www.w3schools.com/php/php_mysql_connect.asp
$conn = new mysqli($servername, $username, $password, $dbname);

// define variables
$data = array();
$answer;

/// ---------------------------------------------------------------------
/// --- GET --- List all entries of the DB and return JSON
/// --- Doku: https://www.w3schools.com/php/php_mysql_select.asp
/// ---------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // This is the default way to get a list of entries of the table and return
    // all information in JSON to the client.

    // load the data from db
    $sql = "SELECT * FROM `table1`;";
    $result = $conn->query($sql);

    // check if there is a answer
    if ($result->num_rows > 0) {
        // output data of each row
        while ($row = $result->fetch_assoc()) {
            // the following line is an example that shows, how a field is selected
            // echo "task_id: " . $row["task_id"].  "title: " . $row["title"]. " - description: " . $row["description"]. " " . $row["created_at"]. "<br>";
            // push all information to the data array, which will be returned
            array_push($data, $row);
        }
    }
    // send data to client
    header('Content-Type: application/json');
    echo json_encode($data);


/// ---------------------------------------------------------------------
/// --- POST --- Add a new entry to the list
/// --- Doku: https://www.w3schools.com/php/php_mysql_insert.asp
/// ---------------------------------------------------------------------
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // This will add a new row. So we're getting a JSON from the webbrowser. Some checks needs to be done before
    // it's possible to get the information from the request and to add it correctly to the database with a query.

    // Make sure Content-Type is application/json
    $content_type = isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : '';
    if (stripos($content_type, 'application/json') === false) {
        throw new Exception('Content-Type must be application/json');
    }

    // Read the input stream
    $body = file_get_contents("php://input");

    // Decode the JSON object
    $data = json_decode($body, true);

    // Throw an exception if decoding failed
    if (!is_array($data)) {
        throw new Exception('Failed to decode JSON object');
    }

    // check if title and description is set correctly
    if (isset($data['title']) && isset($data['description'])) {
        // The content looks good, so move on
        // Get the content to local variables:
        $title = $data['title'];
        $description = $data['description'];
        // Actual executing the query. Please keep in mind that this is for learning and education.
        // In real production environment, this has to be secure for SQL injection!
        $sql = "INSERT INTO `table1` (`task_id`, `title`, `description`, `created_at`)".
            "VALUES (NULL, '$title', '$description', current_timestamp());";

        if ($conn->query($sql) === true) {
            // Everything is fine with the query
            // INFO: Here can be some checks of modification of the result
            $answer = "Successfuly added to DB"; // <- send it to client
            header('Content-Type: application/json');
            echo json_encode($answer);
        } else {
            // we got an errror - inform the client
            throw new Exception('SQL insert was not successfull' . $conn->error); // <- send to client
        }
    } else {
        // Report the client, that title or/and descrition is missing
        throw new Exception('No "title" or/and "description" was in the JSON request!');
    }


/// ---------------------------------------------------------------------
/// --- DELETE --- Delete one entry with given ID
/// --- Doku: https://www.w3schools.com/php/php_mysql_delete.asp
/// ---------------------------------------------------------------------
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // This path will delete an entry. For example the request would look like DELETE '/database.php?id=5' -> This will delete number 5

    // check if id is set correctly
    if (isset($_GET['id'])) {
        $id = $_GET['id'];

        // sql to delete a record
        $sql = "DELETE FROM `table1` WHERE `table1`.`task_id` = $id;";

        if ($conn->query($sql) === true) {
            // Everything is fine with the query
            // INFO: Here can be some checks of modification of the result
            $answer = "Record deleted successfully";
            // send data to client
            header('Content-Type: application/json');
            echo json_encode($answer);
        } else {
            // we got an errror - inform the client
            $answer = "Error deleting record: " . $conn->error;

            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode($answer);
        }
    }


/// ---------------------------------------------------------------------
/// --- ???? Unkown --- This request is unknown -> return Error!
/// ---------------------------------------------------------------------
} else {
    // Method not known!
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode("ERROR - Unknown request / call");
}

// close connection to DB
$conn->close();

?> 
