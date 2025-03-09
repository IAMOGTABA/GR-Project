<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include required files
include_once '../../config/database.php';
include_once '../../models/User.php';
include_once '../../utils/JWT.php';

// Get JWT token from header
$headers = getallheaders();
$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = null;

// Extract the token
if (!empty($auth_header)) {
    $token_parts = explode(' ', $auth_header);
    if (count($token_parts) == 2 && $token_parts[0] == 'Bearer') {
        $token = $token_parts[1];
    }
}

// Verify token
$jwt = new JWT();
if (!$token || !$jwt->validate($token)) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Unauthorized access'
    ));
    exit();
}

// Get user data from token
$token_data = $jwt->decode($token);

// Check if user is admin
if ($token_data->role != 'admin') {
    echo json_encode(array(
        'success' => false,
        'message' => 'Only administrators can delete users'
    ));
    exit();
}

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Check if user ID is provided
if (!isset($data->id) || empty($data->id)) {
    echo json_encode(array(
        'success' => false,
        'message' => 'User ID is required'
    ));
    exit();
}

// Initialize database and user model
$database = new Database();
$db = $database->connect();
$user = new User($db);

// Set user ID
$user->id = $data->id;

// Check if user exists
if (!$user->read_single()) {
    echo json_encode(array(
        'success' => false,
        'message' => 'User not found'
    ));
    exit();
}

// Prevent deleting self
if ($token_data->user_id == $user->id) {
    echo json_encode(array(
        'success' => false,
        'message' => 'You cannot delete your own account'
    ));
    exit();
}

// Delete the user
if ($user->delete()) {
    echo json_encode(array(
        'success' => true,
        'message' => 'User deleted'
    ));
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'User not deleted'
    ));
} 