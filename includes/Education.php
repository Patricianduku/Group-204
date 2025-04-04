<?php
// Include database connection
require_once 'db_connection.php';

header('Content-Type: application/json');

try {
    // Fetch education items from database
    $stmt = $pdo->prepare("SELECT * FROM education ORDER BY start_date DESC");
    $stmt->execute();
    $education = $stmt->fetchAll();
    
    echo json_encode($education);
} catch(PDOException $e) {
    // Return error message
    echo json_encode([
        'error' => true,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>