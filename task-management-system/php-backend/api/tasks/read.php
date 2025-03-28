<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

// Debug logging
error_log("read.php accessed");
error_log("Request Method: " . $_SERVER['REQUEST_METHOD']);
error_log("Request URI: " . $_SERVER['REQUEST_URI']);

// Get JWT token from header
$headers = getallheaders();
error_log("Headers: " . print_r($headers, true));

$auth_header = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$token = null;

// Extract the token
if (!empty($auth_header)) {
    $token_parts = explode(' ', $auth_header);
    if (count($token_parts) == 2 && $token_parts[0] == 'Bearer') {
        $token = $token_parts[1];
    }
}

error_log("Token: " . ($token ?? 'No token provided'));

// Static tasks data
$tasks = array(
    array(
        'id' => 1,
        'title' => 'Complete project documentation',
        'description' => 'Write detailed documentation for the new task management system',
        'status' => 'pending',
        'priority' => 'high',
        'due_date' => '2024-06-15',
        'assigned_to' => 'John Doe',
        'created_by' => 'Admin User',
        'created_at' => '2024-06-01'
    ),
    array(
        'id' => 2,
        'title' => 'Fix login page bug',
        'description' => 'There is an issue with the login form validation',
        'status' => 'in-progress',
        'priority' => 'medium',
        'due_date' => '2024-06-10',
        'assigned_to' => 'John Doe',
        'created_by' => 'Admin User',
        'created_at' => '2024-06-02'
    ),
    array(
        'id' => 3,
        'title' => 'Design new dashboard',
        'description' => 'Create wireframes for the new admin dashboard',
        'status' => 'overdue',
        'priority' => 'high',
        'due_date' => '2024-06-05',
        'assigned_to' => 'Jane Smith',
        'created_by' => 'Admin User',
        'created_at' => '2024-06-01'
    )
);

// Return tasks
echo json_encode(array(
    'success' => true,
    'message' => 'Tasks retrieved successfully',
    'count' => count($tasks),
    'data' => $tasks
)); 