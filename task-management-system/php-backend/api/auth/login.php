<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get posted data
$data = json_decode(file_get_contents('php://input'), true);

// Check for required fields
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(array(
        'success' => false,
        'message' => 'Email and password are required'
    ));
    exit();
}

// Static user credentials for demo
$valid_users = array(
    array(
        'email' => 'admin@example.com',
        'password' => 'admin123',
        'name' => 'Admin User',
        'role' => 'admin'
    ),
    array(
        'email' => 'user@example.com',
        'password' => 'user123',
        'name' => 'Regular User',
        'role' => 'user'
    )
);

// Check credentials
$authenticated = false;
$user = null;

foreach ($valid_users as $valid_user) {
    if ($data['email'] === $valid_user['email'] && $data['password'] === $valid_user['password']) {
        $authenticated = true;
        $user = $valid_user;
        break;
    }
}

if ($authenticated) {
    // Generate a simple token
    $token = 'demo-token-' . base64_encode($user['email'] . ':' . time());
    
    echo json_encode(array(
        'success' => true,
        'message' => 'Login successful',
        'data' => array(
            'token' => $token,
            'user' => array(
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            )
        )
    ));
} else {
    http_response_code(401);
    echo json_encode(array(
        'success' => false,
        'message' => 'Invalid email or password'
    ));
} 