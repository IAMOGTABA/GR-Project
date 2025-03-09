<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include required files
include_once '../../config/database.php';
include_once '../../models/Task.php';
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

// Check if task ID is provided
if (!isset($data->id) || empty($data->id)) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Task ID is required'
    ));
    exit();
}

// Initialize database and task model
$database = new Database();
$db = $database->connect();
$task = new Task($db);

// Set task ID
$task->id = $data->id;

// Check if task exists
if (!$task->read_single()) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Task not found'
    ));
    exit();
}

// Delete the task
if ($task->delete()) {
    echo json_encode(array(
        'success' => true,
        'message' => 'Task deleted'
    ));
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Task not deleted'
    ));
} 