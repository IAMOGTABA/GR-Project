<?php
require_once 'JWT.php';

function authenticate() {
    // Headers
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json');
    
    // Initialize response
    $response = array(
        'success' => false,
        'message' => '',
        'data' => null
    );
    
    // Get authorization header
    $headers = getallheaders();
    $auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    // Check if authorization header exists
    if(!$auth_header) {
        $response['message'] = 'Authorization header is required';
        echo json_encode($response);
        exit();
    }
    
    // Extract token from header
    $token_parts = explode(' ', $auth_header);
    
    if(count($token_parts) != 2 || strtolower($token_parts[0]) != 'bearer') {
        $response['message'] = 'Invalid authorization format. Format is: Bearer <token>';
        echo json_encode($response);
        exit();
    }
    
    $token = $token_parts[1];
    
    // Validate token
    $payload = JWT::validate($token);
    
    if(!$payload) {
        $response['message'] = 'Invalid or expired token';
        echo json_encode($response);
        exit();
    }
    
    // Return payload if token is valid
    return $payload;
}

function authorize_admin() {
    $user = authenticate();
    
    // Check if user is admin
    if($user['role'] !== 'admin') {
        // Initialize response
        $response = array(
            'success' => false,
            'message' => 'Access denied. Admin privileges required.',
            'data' => null
        );
        
        echo json_encode($response);
        exit();
    }
    
    return $user;
} 