<?php
    include "../db.php"; 
    // incoming request 
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks for the id of the user and id of the specific contact 
    if (!isset($data["ownerID"]) || !isset($data["id"])) {
        echo json_encode(["error" => "Did not receive ownerID or id to add new contact for user"]); 
        exit; 
    }

    // Checks to see if required params have been inputted
    if (!isset($data["firstName"]) || (!isset($data["lastName"])) || !isset($data['email'])) {
        echo json_encode(["error" => "firstName, lastName and email are required fields"]); 
        exit; 
    }

    // makes sure that at least one parameter is being updated 
    if (!isset($data["updateFirstName"]) && !isset($data["updateLastName"]) && !isset($data["updateEmail"])) {
        echo json_encode(["error" => "Please update at least one field"]); 
        exit; 
    }

    // Params for SQL Query    
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $email = $data['email']; 
    $ownerID = $data['ownerID'];
    $id = $data['id'];

    $updateFirstName = isset($data['updateFirstName']) ? $data['updateFirstName'] : $firstName;
    $updateLastName = isset($data['updateLastName']) ? $data['updateLastName'] : $lastName;
    $updateEmail = isset($data['updateEmail']) ? $data['updateEmail'] : $email; 

    // SQL query to insert data
    $sql = "UPDATE Contacts SET FirstName = ?, LastName = ?, email = ? WHERE ID = ? AND ownerID = ?";
    $stmt = $conn->prepare($sql); 
    $stmt->bind_param("sssii", $updateFirstName, $updateLastName, $updateEmail, $id, $ownerID);  


    // Executes SQL query and checks if it was valid 
    if ($stmt->execute()) {
        echo json_encode(["message" => "Contact has been updated"]);
    } else {
        echo json_encode(["message" => "Failed to update Account"]); 
    }

    $stmt->close();
    $conn->close(); 
?>
