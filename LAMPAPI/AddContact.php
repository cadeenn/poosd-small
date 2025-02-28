<?php
    include "db.php"; 
    // incoming POST request 
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks to see if required params have been inputted
    if (!isset($data["Name"]) || (!isset($data["Phone"])) || !isset($data["Email"])) {
        echo json_encode(["success" => false, "message" => "Name, phone number and email are required fields"]); 
        exit; 
    }
    
    if (!isset($data["UserId"])) {
        echo json_encode(["success" => false, "message" => "Did not receive userId to add new contact for user"]); 
        exit; 
    }

    // Params for SQL Query    
    $firstName = $data['Name'];
    $phone = $data['Phone'];
    $email = $data['Email']; 
    $userId = $data['UserId'];     

    try {
        // SQL query to insert data
        $stmt = $conn->prepare("INSERT INTO Contacts (Name, Phone, Email, UserId) VALUES (?, ?, ?, ?)"); 
        $stmt->bind_param("sssi", $firstName, $phone, $email, $ownerID);  

        // Executes SQL query and checks if it was valid 
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Contact has been added", "ID" => $stmt->insert_id]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to create contact", "ID" => NULL]); 
        }
    } catch (Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

    $stmt->close();
    $conn->close(); 
?>
