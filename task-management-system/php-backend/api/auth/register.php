<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include files
require_once '../../includes/User.php';
require_once '../../includes/JWT.php';

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Initialize response
$response = array(
    'success' => false,
    'message' => '',
    'data' => null
);

// Check if required fields are provided
if(
    !isset($data->name) || 
    !isset($data->email) || 
    !isset($data->password)
) {
    $response['message'] = 'Name, email and password are required';
    echo json_encode($response);
    exit();
}

// Create user object
$user = new User();

// Check if email already exists
$user->email = $data->email;
if($user->getByEmail()) {
    $response['message'] = 'Email already exists';
    echo json_encode($response);
    exit();
}

// Set user properties
$user->name = $data->name;
$user->email = $data->email;
$user->password = $data->password;
$user->role = isset($data->role) ? $data->role : 'user';
$user->department = isset($data->department) ? $data->department : null;
$user->position = isset($data->position) ? $data->position : null;
$user->phone = isset($data->phone) ? $data->phone : null;
$user->avatar = isset($data->avatar) ? $data->avatar : 'default-avatar.jpg';

// Create user
if($user->create()) {
    // User created, generate token
    $token_payload = array(
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role
    );
    
    // Generate JWT
    $token = JWT::generate($token_payload);
    
    $response['success'] = true;
    $response['message'] = 'User registered successfully';
    $response['data'] = array(
        'token' => $token,
        'user' => array(
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'department' => $user->department,
            'position' => $user->position,
            'phone' => $user->phone,
            'avatar' => $user->avatar
        )
    );
} else {
    $response['message'] = 'User registration failed';
}

// Return response
echo json_encode($response); 