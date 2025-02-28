<?php
    header("Content-Type: application/json; charset=UTF-8");
    require "db.php"; 

    // Decode incoming JSON request
    $data = json_decode(file_get_contents("php://input"), true);

    // Check if required parameters are present
    if (!isset($data["Login"]) || !isset($data["Password"])) {
        echo json_encode(["success" => false, "message" => "Login and Password are required", "ID" => -1]);
        exit;
    }

    $userLogin = $data["Login"]; 
    $password = $data["Password"];

    // Prepare and execute the SQL query
    try {
        $stmt = $conn->prepare("SELECT ID, Password FROM Users WHERE Login = ? OR Email = ?");
        $stmt->bind_param("ss", $userLogin, $userLogin);
        $stmt->execute();
        $res = $stmt->get_result();
        $user = $res->fetch_assoc();

        if ($user["ID"] && $user["Password"]) {
            echo json_encode(["success" => true, "ID" => $user["ID"], "FirstName" => $user["FirstName"], "LastName" => $user["LastName"]]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid login credentials", "ID" => NULL]);
        }
    } catch(Exception $e) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }

    // Close database connections
    $stmt->close();
    $conn->close();
?>
