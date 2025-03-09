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

// Initialize database and task model
$database = new Database();
$db = $database->connect();
$task = new Task($db);

// Get query parameters for filtering
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;

// Get tasks
$result = $task->read($user_id, $status, $search);
$num = $result->rowCount();

// Check if any tasks
if ($num > 0) {
    // Tasks array
    $tasks_arr = array();
    $tasks_arr['data'] = array();

    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);

        $task_item = array(
            'id' => $id,
            'title' => $title,
            'description' => $description,
            'status' => $status,
            'priority' => $priority,
            'due_date' => $due_date,
            'created_at' => $created_at,
            'updated_at' => $updated_at,
            'created_by' => $created_by,
            'assigned_to' => $assigned_to,
            'created_by_name' => isset($created_by_name) ? $created_by_name : null,
            'assigned_to_name' => isset($assigned_to_name) ? $assigned_to_name : null
        );

        // Push to "data"
        array_push($tasks_arr['data'], $task_item);
    }

    // Set response
    $response = array(
        'success' => true,
        'count' => $num,
        'data' => $tasks_arr['data']
    );

    // Add filter info if applicable
    if ($user_id) {
        $response['filter'] = array('user_id' => $user_id);
    } elseif ($status) {
        $response['filter'] = array('status' => $status);
    } elseif ($search) {
        $response['filter'] = array('search' => $search);
    }

    // Turn to JSON & output
    echo json_encode($response);
} else {
    // No Tasks
    echo json_encode(array(
        'success' => true,
        'message' => 'No tasks found',
        'count' => 0,
        'data' => array()
    ));
} 