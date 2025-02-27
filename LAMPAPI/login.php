<?php
    header("Content-Type: application/json; charset=UTF-8");
    require "db.php"; 

    // Incoming POST request
    $data = json_decode(file_get_contents("php://input"), true); 

    // Checks to see if required params have been inputted
    if (!isset($data["Login"]) || !isset($data["Password"])) {
        echo json_encode(["success" => false, "message" => "Username and Password are required", "ID" => NULL]);
        exit;
    }

    $username = $data["Login"]; 
    $password = $data["Password"]; 

    // Prepare and execute the SQL query
    try {
        $stmt = $conn->prepare("SELECT * FROM Users WHERE Login = ? AND Password = ?");
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();
        $res = $stmt->get_result();
        $user = $res->fetch_assoc();

        if($user["ID"]) {
            echo json_encode(["success" => true, "ID" => $user["ID"]]); 
        } else {
            echo json_encode(["success" => false, "ID" => NULL]); 
        }
    } catch(Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500); 
        echo json_encode(["success" => false, "message" => $e->getMessage()]); 
    }

    // close connections to db
    $stmt->close();
    $conn->close();
?>