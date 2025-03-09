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
if(!isset($data->email) || !isset($data->password)) {
    $response['message'] = 'Email and password are required';
    echo json_encode($response);
    exit();
}

// Create user object
$user = new User();
$user->email = $data->email;

// Check if user exists
if($user->getByEmail()) {
    // Check password
    if($user->verifyPassword($data->password)) {
        // User matched
        $token_payload = array(
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role
        );
        
        // Generate JWT
        $token = JWT::generate($token_payload);
        
        $response['success'] = true;
        $response['message'] = 'Login successful';
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
        $response['message'] = 'Invalid password';
    }
} else {
    $response['message'] = 'User not found';
}

// Return response
echo json_encode($response); 