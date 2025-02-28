<?php
    include "db.php"; 
    header("Content-Type: application/json; charset=UTF-8");

    // Incoming POST request
    $data = json_decode(file_get_contents("php://input"), true);

    // Checks to see if required params have been inputted
    if (!isset($data["Login"]) || !isset($data["Password"]) ||
    !isset($data["FirstName"]) || !isset($data["LastName"]) || !isset($data["Email"])) {
        echo json_encode(["success" => false, "message" => "All Fields have not been filled in"]);
        exit; 
    }

    // Params for SQL query 
    $username = $data["Login"];
    $firstName = $data["FirstName"]; 
    $lastName = $data["LastName"]; 
    $email = $data["Email"]; 
    $password = $data["Password"]; 

    // Builds and executes SQL query 
    try {

        // checks for duplicate usernames or emails within the database
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login = ? OR Email = ?");
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Username or Email already exists", "ID" => NULL]);
            $stmt->close();
            $conn->close();
            exit;
        }
        $stmt->close();

        $stmt = $conn->prepare("INSERT INTO Users (Login, FirstName, LastName, Email, Password) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $username, $firstName, $lastName, $email, $password); 

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "User, $username, has been created", "ID" => $stmt->insert_id]);
        } else {
            echo json_encode(["success" => false, "message" => "Could not add User at this time", "ID" => NULL]);
        }
    } catch(Exception $e){
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);

    }

    $stmt->close();
    $conn->close(); 

?>