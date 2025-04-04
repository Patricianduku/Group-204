<?php
// Include database connection
require_once 'db_connection.php';

header('Content-Type: application/json');

try {
    // Fetch projects from database
    $stmt = $pdo->prepare("SELECT * FROM projects ORDER BY id DESC");
    $stmt->execute();
    $projects = $stmt->fetchAll();
    
    echo json_encode($projects);
} catch(PDOException $e) {
    // Return error message
    echo json_encode([
        'error' => true,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>