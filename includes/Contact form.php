<?php
// Include database connection
require_once 'db_connection.php';

header('Content-Type: application/json');

// Get the JSON data from the request
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Validate the input data
if (
    !isset($data['name']) || empty($data['name']) ||
    !isset($data['email']) || empty($data['email']) ||
    !isset($data['message']) || empty($data['message'])
) {
    echo json_encode([
        'success' => false,
        'message' => 'Please fill in all required fields.'
    ]);
    exit;
}

// Validate email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

try {
    // Insert message into database
    $stmt = $pdo->prepare("INSERT INTO messages (name, email, message, created_at) VALUES (:name, :email, :message, NOW())");
    $stmt->execute([
        ':name' => $data['name'],
        ':email' => $data['email'],
        ':message' => $data['message']
    ]);
    
    // Send email notification (optional)
    $to = 'ndukupatricia136@gmail.com';
    $subject = 'New Contact Form Submission';
    $message = "You have received a new message from your website contact form.\n\n";
    $message .= "Name: " . $data['name'] . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    $message .= "Message:\n" . $data['message'] . "\n";
    
    $headers = 'From: ' . $data['email'] . "\r\n" .
        'Reply-To: ' . $data['email'] . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    
    mail($to, $subject, $message, $headers);
    
    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully.'
    ]);
} catch(PDOException $e) {
    // Return error message
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>