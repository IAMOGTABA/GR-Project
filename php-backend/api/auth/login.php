<?php
/**
 * Login endpoint
 */

// Allow only POST requests for login
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only POST is accepted.'
    ]);
    exit();
}

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'Email and password are required.'
    ]);
    exit();
}

$email = $data['email'];
$password = $data['password'];

// Demo authentication - in a real app, this would check against a database
if (($email === 'admin@example.com' && $password === 'admin123') || 
    ($email === 'employee@example.com' && $password === 'employee123')) {
    
    // Determine user role
    $role = ($email === 'admin@example.com') ? 'admin' : 'employee';
    $name = ($email === 'admin@example.com') ? 'Admin User' : 'Regular Employee';
    
    // Create a simple JWT-like token (demo only)
    $token = base64_encode(json_encode([
        'sub' => $email,
        'name' => $name,
        'role' => $role,
        'exp' => time() + 3600
    ]));
    
    // Return success response with token
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'token' => $token,
            'user' => [
                'email' => $email,
                'name' => $name,
                'role' => $role
            ]
        ]
    ]);
} else {
    // Return error response
    http_response_code(401); // Unauthorized
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email or password'
    ]);
}
?> 