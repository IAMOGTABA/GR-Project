<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include files
require_once '../../includes/User.php';
require_once '../../includes/authenticate.php';

// Authenticate user
$auth_user = authenticate();

// Create user object
$user = new User();

// Get users
$result = $user->getAll();
$num = $result->rowCount();

// Initialize response
$response = array(
    'success' => false,
    'message' => '',
    'data' => null
);

// Check if any users found
if($num > 0) {
    $users_arr = array();
    
    while($row = $result->fetch()) {
        $user_item = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'email' => $row['email'],
            'role' => $row['role'],
            'department' => $row['department'],
            'position' => $row['position'],
            'phone' => $row['phone'],
            'avatar' => $row['avatar'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        );
        
        array_push($users_arr, $user_item);
    }
    
    $response['success'] = true;
    $response['message'] = $num . ' users found';
    $response['data'] = $users_arr;
} else {
    $response['message'] = 'No users found';
}

// Return response
echo json_encode($response); 