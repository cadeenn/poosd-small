
<?php
    include "../db.php"; 
    
    // Incoming POST request
    $data = json_decode(file_get_contents("php://input"), true); 

    // Checks to see if required params have been inputted
    if (!isset($data["ownerID"])) {
        echo json_encode(["error" => "ownerID is a required field"]); 
        exit; 
    }

    // Param for SQL query 
    $ownerID = $data["ownerID"];
    
    // SQL query to fetch data 
    $sql = "SELECT * FROM Contacts WHERE OwnerID = ?"; 
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $ownerID); 
    
    // Executes SQL query and checks if it was valid 
    if ($stmt->execute()){
        $res = $stmt->get_result();
        $contacts = $res->fetch_all(MYSQLI_ASSOC);
        echo json_encode($contacts); 
    } else {
        echo json_encode(["error" => "Could not get contacts for $ownerID"]); 
        exit; 
    }

    $stmt->close();
    $conn->close(); 

?>