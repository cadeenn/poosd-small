<?php
    $data = parse_ini_file('.env'); 

    $host = $data["HOST"];
    $dbName = $data["DATABASE_NAME"];
    $dbUser = $data["DATABASE_USER"]; 
    $dbPassword = $data["DATABASE_PASSWORD"]; 

    $conn = new mysqli($host, $dbUser, $dbPassword, $dbName); 

    if ($conn->connect_error) {
        die("Connection Failed: " . $conn->connect_error); 
        exit; 
    } else {
        echo "Successfully Connected to db \n"; 
    }
?>