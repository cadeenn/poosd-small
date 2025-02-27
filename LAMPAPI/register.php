<?php
    include "../db.php"; 

    // Incoming POST request
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks to see if required params have been inputted
    if (!isset($data["Username"]) || !isset($data["Password"]) || !isset($data[""])) {
        echo json_encode(["error" => "Username and Password are required fields"]); 
        exit; 
    }

    // Params for SQL query 
    $username = $data["username"]; 
    $password = $data["password"]; 

    // SQL query to insert data
    try {
        $stmt = $conn->prepare("INSERT INTO Users (Username, Password) VALUES (?, ?)");
        $stmt->bind_param("ss", $username, $password); 

        // Executes SQL query 
        if ($stmt->execute()) {
            echo json_encode(["message" => "Contact has been added", "id" => $stmt->insert_id]);
        } else {
            echo json_encode(["Error" => "Failed to create contact"]); 
        }
    }  catch (Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500); 
        echo json_encode(["success" => false, "message" => $e->getMessage()]); 
    }


    $stmt->close();
    $conn->close(); 

?>