<?php
    require "db.php"; 
    $data = json_decode(file_get_contents("php://input"), true); 

    try {
        if (!isset($data["Login"]) || !isset($data["Password"])){
            echo json_encode(["error" => "Username and Password are required fields"]);
            exit; 
        }
    }catch (Exception $e) {
        echo json_encode(["error" => "$e"]); 
    }

    // Params for SQL query 
    $username = $data["Login"]; 
    $password = $data["Password"]; 

    // SQL Query to get User info and logs in user 

    try {
        $stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ? AND Password = ?"); 
        $stmt->bind_param("ss", $username, $password); 
        $stmt->execute(); 
        $res = $stmt->get_result(); 
        $user = $res->fetch_assoc(); 
    } catch (Exception $e) {
        echo json_encode(["error" => "$e"]); 
    }

    // Checks if user was valid user in the db 
    if($user) {
        echo json_encode(["ID"=> $user['ID']]); 
    } else {
        echo json_encode(["message" => "Invalid Credentials"]); 
    }

    $stmt->close(); 
    $conn->close(); 
?>