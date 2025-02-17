<?php
    include "../db.php"; 
    // incoming request 
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks to see if required params have been inputted
    if (!isset($data["firstName"]) || !isset($data["lastName"]) || !isset($data['email'])) {
        echo json_encode(["error" => "First Name, Last Name and email are required fields"]); 
        exit; 
    }
    
    if (!isset($data["ownerID"])) {
        echo json_encode(["error" => "Did not receive ownerID to add new contact for user"]); 
        exit; 
    }

    if (!isset($data["updateFirstName"]) || !isset($data["updateLastName"]) || !isset($data["updateEmail"])) {
    echo json_encode(["error" => "First Name, Last Name, and email are required fields"]);
    exit;
}

    // Params for SQL Query    
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $email = $data['email']; 
    $ownerID = $data['ownerID'];
    // New Values
    $updateFirstName = $data['updateFirstName'];
    $updateLastName = $data['updateLastName'];
    $updateEmail = $data['updateEmail'];

    // SQL query to insert data
    $sql = "UPDATE Contacts SET FirstName = ?, LastName = ?, email = ?
    WHERE FirstName = ? AND LastNAME = ? AND email = ? AND ownerID = ?";
    $stmt = $conn->prepare($sql); 
    $stmt->bind_param("ssssssi", $updateFirstName, $updateLastName, $updateEmail, $firstName, $lastName, $email, $ownerID);  

    // Executes SQL query and checks if it was valid 
    if ($stmt->execute()) {
        echo json_encode(["message" => "Account has been updated"]);
    } else {
        echo json_encode(["message" => "Failed to update Account"]); 
    }

    $stmt->close();
    $conn->close(); 
?>
