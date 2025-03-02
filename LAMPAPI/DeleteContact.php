<?php
    header("Content-Type: application/json; charset=UTF-8");
    include "db.php"; 

    // incoming request 
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks to see if required params have been inputted
    if (!isset($data["Name"]) || (!isset($data["Phone"])) || !isset($data["Email"])) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 400 Internal Server Error', true, 400);
        echo json_encode(["success" => false, "message" => "Name, phone number and email are required fields"]); 
        exit; 
    }

    // Check if UserId have been received 
    if (!isset($data["UserId"])) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 400 Internal Server Error', true, 400);
        echo json_encode(["success" => false, "message" => "Did not receive userId to add new contact for user"]); 
        exit; 
    }

    // Params for SQL Query    
    $name = $data['Name'];
    $phone = $data['Phone'];
    $email = $data['Email']; 
    $userId = $data['UserId'];     

    try {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE Name = ? AND Phone = ? AND Email = ? AND UserId = ?");
        $stmt-> bind_param("sssi", $name, $phone, $email, $userId); 
        
        if (($stmt->execute())) {
            echo "Contact was deleted"; 
        } 
    } catch (Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

    $stmt->close();
    $conn->close();
?>
