<?php

// This is button 1 sample with POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // The request is using the POST method
    // collect value of input field
    $name = $_POST['name'];
    // check if name is empty
    if (empty($name)) {
        $name = "Name is empty";
    } 
    // convert output to JSON
    header('Content-Type: application/json');
    $data = ['message' => 'I got your message - Name is: ' . $name];
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // This is the button 2 sample with GET
    echo "Antwort: " . rand();
}

?>
