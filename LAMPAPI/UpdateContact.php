<?php
    include "db.php"; 
    // incoming request 
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks for the id of the user and id of the specific contact 
    if (!isset($data["UserId"]) || !isset($data["ID"])) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 400 Internal Server Error', true, 400);
        echo json_encode(["success" => false, "message" => "Did not get UserId and ID (contactID)"]); 
        exit; 
    }

    // Checks to see if required params have been inputted
    if (!isset($data["Name"]) || (!isset($data["Phone"])) || !isset($data["Email"])) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 400 Internal Server Error', true, 400);
        echo json_encode(["success" => false, "message" => "Name, phone number and email are required fields"]); 
        exit; 
    }

    // Params for SQL Query    
    $name = $data['Name']; 
    $phone = $data['Phone'];
    $email = $data['Email']; 
    $userId = $data['UserId'];     
    $contactId = $data['ID']; 

    try {
        // SQL query to insert data
        $sql = "UPDATE Contacts SET Name = ?, Phone = ?, Email = ? WHERE ID = ? AND UserId = ?";
        $stmt = $conn->prepare($sql); 
        $stmt->bind_param("sssii", $name, $phone, $email, $contactId, $userId);  

        // Executes SQL query and checks if it was valid 
        if ($stmt->execute()) {
            echo json_encode(["message" => "Contact has been updated"]);
        } else {
            echo json_encode(["message" => "Failed to update Account"]); 
        }

    } catch (Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

    $stmt->close();
    $conn->close(); 
?>
