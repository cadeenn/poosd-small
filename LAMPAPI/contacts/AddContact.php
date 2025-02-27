<?php
    include "../db.php"; 
    // incoming POST request 
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks to see if required params have been inputted
    if (!isset($data["firstName"]) || (!isset($data["lastName"])) || !isset($data['email'])) {
        echo json_encode(["error" => "firstName, lastName and email are required fields"]); 
        exit; 
    }
    
    if (!isset($data["ownerID"])) {
        echo json_encode(["error" => "Did not receive ownerID to add new contact for user"]); 
        exit; 
    }

    // Params for SQL Query    
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $email = $data['email']; 
    $ownerID = $data['ownerID'];     

    // SQL query to insert data
    $sql = "INSERT INTO Contacts (FirstName, LastName, email, ownerID) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql); 
    $stmt->bind_param("sssi", $firstName, $lastName, $email, $ownerID);  

    // Executes SQL query and checks if it was valid 
    if ($stmt->execute()) {
        echo json_encode(["message" => "Contact has been added", "id" => $stmt->insert_id]);
    } else {
        echo json_encode(["error" => "Failed to create contact"]); 
    }

    $stmt->close();
    $conn->close(); 
?>
