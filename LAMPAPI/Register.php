<?php
    include "../db.php"; 

    //TODO: avoid duplicate users 

    // Incoming POST request
    $data = json_decode(file_get_contents("php://input"), true);

    // Makes sure required Params are entered 
    if (!isset($data["Email"]) || !isset($data["Password"]) || !isset($data["Login"])|| !isset($data["LastName"]) || !isset($data["FirstName"])){
        echo json_encode(["error" => "Please fill in all required fields"]);
        exit; 
    }

    try {
        // Params for SQL query 
        $username = $data["Login"]; 
        $email = $data["Email"]; 
        $password = $data["Password"]; 
        $firstName = $data["FirstName"]; 
        $lastName = $data["LastName"]; 

        // SQL query to insert data
        $stmt = $conn->prepare("INSERT INTO Users (Login, Password, FirstName, LastName, Email) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $username, $password, $firstName, $lastName, $email); 
    } catch (Exception $e) {
        echo json_encode(["error" => $e]);
    }
    
    // Executes SQL query 
    if ($stmt->execute()) {
        echo json_encode(["message" => "User has been added", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["Error" => "Failed to create contact"]); 
    }

    $stmt->close();
    $conn->close(); 

?>