<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
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

// Get user data from token
$token_data = $jwt->decode($token);
$token_user_id = $token_data->user_id;

// Check if user is updating their own profile or is an admin
if ($token_user_id != $user->id && $token_data->role != 'admin') {
    echo json_encode(array(
        'success' => false,
        'message' => 'You can only update your own profile'
    ));
    exit();
}

// Update user properties if provided
if (isset($data->name) && !empty($data->name)) {
    $user->name = $data->name;
}

if (isset($data->email) && !empty($data->email)) {
    // Check if email already exists
    $check_user = new User($db);
    if ($check_user->email_exists($data->email) && $check_user->id != $user->id) {
        echo json_encode(array(
            'success' => false,
            'message' => 'Email already exists'
        ));
        exit();
    }
    $user->email = $data->email;
}

if (isset($data->password) && !empty($data->password)) {
    $user->password = password_hash($data->password, PASSWORD_DEFAULT);
}

if (isset($data->role) && !empty($data->role)) {
    // Only admin can change roles
    if ($token_data->role == 'admin') {
        $user->role = $data->role;
    }
}

if (isset($data->avatar)) {
    $user->avatar = $data->avatar;
}

// Update the user
if ($user->update()) {
    // Get updated user details
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
        'message' => 'User updated',
        'data' => $user_arr
    ));
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'User not updated'
    ));
} 