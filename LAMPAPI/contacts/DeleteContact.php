<?php
    include "../db.php"; 
    $data = json_decode(file_get_contents("php://input"), true);

    // TODO: Delete contact based on ID
    // Checks to see if required params have been inputted
    if (!isset($data["firstName"]) ||  (!isset($data["lastName"])) || !isset($data['email'])) {
        echo json_encode(["error" => "First Name, Last Name and email are required fields"]); 
        exit; 
    }
    
    // Params for SQL Query UPDATE TO DELETE
    $firstName = $data['firstName'];
    $lastName = $data['lastName'];
    $email = $data['email']; 
    $ownerID = $data['ownerID'];

    // SQL query to insert data
    $sql = "DELETE FROM Contacts WHERE FirstName = ? AND LastName = ? AND Email = ? AND OwnerID = ?";
    $stmt = $conn->prepare($sql); 
    $stmt->bind_param("sssi", $firstName, $lastName, $email, $ownerID);

    // Executes SQL query and checks if it was valid 
    if ($stmt->execute()) {
        echo json_encode(["message" => "Contact has been deleted"]);
    } else {
        echo json_encode(["message" => "Failed to delete contact"]); 
    }

    $stmt->close();
    $conn->close();
?>