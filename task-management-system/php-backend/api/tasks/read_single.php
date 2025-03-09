<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

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

// Check if ID parameter exists
if (!isset($_GET['id'])) {
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

// Set ID to read
$task->id = $_GET['id'];

// Read single task
if ($task->read_single()) {
    // Create task array
    $task_arr = array(
        'id' => $task->id,
        'title' => $task->title,
        'description' => $task->description,
        'status' => $task->status,
        'priority' => $task->priority,
        'due_date' => $task->due_date,
        'created_at' => $task->created_at,
        'updated_at' => $task->updated_at,
        'created_by' => $task->created_by,
        'assigned_to' => $task->assigned_to,
        'created_by_name' => $task->created_by_name,
        'assigned_to_name' => $task->assigned_to_name
    );

    // Make JSON
    echo json_encode(array(
        'success' => true,
        'data' => $task_arr
    ));
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Task not found'
    ));
} 