<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
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
        'message' => 'Only administrators can create users'
    ));
    exit();
}

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Check required fields
if (!isset($data->name) || !isset($data->email) || !isset($data->password) || 
    empty($data->name) || empty($data->email) || empty($data->password)) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Name, email and password are required'
    ));
    exit();
}

// Initialize database and user model
$database = new Database();
$db = $database->connect();
$user = new User($db);

// Check if email already exists
if ($user->email_exists($data->email)) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Email already exists'
    ));
    exit();
}

// Set user properties
$user->name = $data->name;
$user->email = $data->email;
$user->password = password_hash($data->password, PASSWORD_DEFAULT);
$user->role = isset($data->role) && !empty($data->role) ? $data->role : 'user';
$user->avatar = isset($data->avatar) && !empty($data->avatar) ? $data->avatar : null;

// Create the user
if ($user->create()) {
    // Get the created user's ID
    $user_id = $db->lastInsertId();
    $user->id = $user_id;
    $user->read_single();
    
    // Create response array
    $user_arr = array(
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'avatar' => $user->avatar,
        'created_at' => $user->created_at
    );
    
    echo json_encode(array(
        'success' => true,
        'message' => 'User created',
        'data' => $user_arr
    ));
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'User not created'
    ));
} 