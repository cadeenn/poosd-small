<?php
    require "../db.php"; 
    $data = json_decode(file_get_contents("php://input"), true); 

    if (!isset($data["username"]) || !isset($data["password"])){
        echo json_encode(["error" => "username and password are required fields"]);
        exit; 
    }

    // Params for SQL query 
    $username = $data["username"]; 
    $password = $data["password"]; 

    // SQL Query to get User info and logs in user 
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Username = ? AND Password = ?"); 
    $stmt->bind_param("ss", $username, $password); 
    $stmt->execute(); 
    $res = $stmt->get_result(); 
    $user = $res->fetch_assoc(); 

    // Checks if user was valid user in the db 
    if($user) {
        echo json_encode(["message" => "Login Successful", "id"=> $user['ID']]); 
    } else {
        echo json_encode(["message" => "Invalid Credentials"]); 
    }

    $stmt->close(); 
    $conn->close(); 
?>