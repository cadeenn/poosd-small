<?php
    header("Content-Type: application/json; charset=UTF-8");
    include "db.php"; 

    // Incoming request 
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if required parameters are provided
    if (!isset($data["ID"]) || !isset($data["UserId"])) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 400 Bad Request', true, 400);
        echo json_encode(["success" => false, "message" => "ID and UserId are required"]); 
        exit; 
    }

    // Parameters for SQL Query    
    $contactId = $data['ID'];
    $userId = $data['UserId'];     

    try {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserId = ?");
        $stmt->bind_param("ii", $contactId, $userId); 
        
        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Contact was deleted"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to delete contact"]);
        }
    } catch (Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

    $stmt->close();
    $conn->close();
?>