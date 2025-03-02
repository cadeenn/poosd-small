
<?php
    include "../db.php"; 
    
    // Incoming POST request
    $data = json_decode(file_get_contents("php://input"), true); 

    // Checks to see if required params have been inputted
    if (!isset($data["UserId"])) {
        echo json_encode(["success" => false, "message" => "Did not receive userId to add new contact for user"]); 
        exit; 
    }

    // Param for SQL query 
    $userId = $data['UserId'];     
    

    try {
        // Executes SQL query and checks if it was valid 
            // SQL query to fetch data 
            $sql = "SELECT * FROM Contacts WHERE UserId = ?"; 
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("i", $userId); 
        if ($stmt->execute()){
            $res = $stmt->get_result();
            $contacts = $res->fetch_all(MYSQLI_ASSOC);
            echo json_encode($contacts); 
        } else {
            echo json_encode(["success" => false, "message" => "Could not get contacts for $ownerID"]); 
            exit; 
        }
    } catch (Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);

    }
    
    $stmt->close();
    $conn->close(); 

?>