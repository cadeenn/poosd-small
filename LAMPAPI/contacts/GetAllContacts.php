
<?php
    include "../db.php"; 

    // TODO: Make sure it gets contacts for user 
    
    // Fetches all users from the data base
    $sql = "SELECT * FROM Contacts"; 
    $result = $conn->query($sql); 

    $contacts = []; 

    // appends each row from the db to users 
    while ($row = $result->fetch_assoc()) {
        $users[] = $row; 
    }

    echo json_encode($users); 
    $conn->close(); 
?>