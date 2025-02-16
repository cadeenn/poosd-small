
<?php
    include "../db.php"; 
    
    // Incoming POST request
    $data = json_decode(file_get_contents("php://input"), true); 

    // Checks to see if required params have been inputted
    if (!isset($data["id"])) {
        echo json_encode(["error" => "user_id is required field"]); 
    }

    // Param for SQL query 
    $id = $data[id];
    
    // SQL query to fetch data 
    $sql = "SELECT * FROM Contacts WHERE id = ?"; 
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", id); 
    
    // Executes SQL query and checks if it was valid 
    if ($stmt->execute()){
        $res = $stmt->get_result();
        $contacts = $result->fetch_all(MYSQL_ASSOC);
        echo json_encode($contacts); 
    } else {
        echo json_encode(["error" => "Could not get contracts for $id"]); 
    }

    $stmt->close();
    $conn->close(); 

?>