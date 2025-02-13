<?php
    include "../db.php"; 

    // Incoming json 
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks to see if required params have been inputted
    if (!isset($data["username"]) || !isset($data["password"])) {
        echo json_encode(["error" => "Username and Password are required fields"]); 
        exit; 
    }

    // Params for SQL query 
    $username = $data["username"]; 
    $password = $data["password"]; 

    // SQL query to insert data
    $stmt = $conn->prepare("INSERT INTO Users (Username, Password) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $password); 

    // Executes SQL query 
    if ($stmt->execute()) {
        echo json_encode(["message" => "Contact has been added", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["Error" => "Failed to create contact"]); 
    }

    $stmt->close();
    $conn->close(); 

?>