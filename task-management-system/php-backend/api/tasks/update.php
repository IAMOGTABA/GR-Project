<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: PUT');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include required files
include_once '../../config/database.php';
include_once '../../models/Task.php';
include_once '../../utils/JWT.php';

// Function to sanitize inputs
function sanitize_input($input) {
    if (is_string($input)) {
        $input = trim($input);
        $input = stripslashes($input);
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
        return $input;
    } elseif (is_array($input)) {
        foreach ($input as $key => $value) {
            $input[$key] = sanitize_input($value);
        }
        return $input;
    } else {
        return $input;
    }
}

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
    http_response_code(401); // Unauthorized
    echo json_encode(array(
        'success' => false,
        'message' => 'Unauthorized access'
    ));
    exit();
}

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Validate inputs
$errors = [];

// Check if task ID is provided
if (!isset($data->id) || empty($data->id)) {
    $errors[] = 'Task ID is required';
}

// Validate other fields if they are provided
if (isset($data->title) && empty(trim($data->title))) {
    $errors[] = 'Title cannot be empty if provided';
}

if (isset($data->due_date) && !empty(trim($data->due_date))) {
    // Validate date format
    if (!preg_match('/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/', $data->due_date)) {
        $errors[] = 'Due date must be in YYYY-MM-DD or YYYY-MM-DD HH:MM:SS format';
    }
}

if (isset($data->status) && !empty($data->status)) {
    $valid_statuses = ['todo', 'in_progress', 'completed', 'cancelled'];
    if (!in_array($data->status, $valid_statuses)) {
        $errors[] = 'Invalid status. Must be one of: ' . implode(', ', $valid_statuses);
    }
}

if (isset($data->priority) && !empty($data->priority)) {
    $valid_priorities = ['low', 'medium', 'high', 'urgent'];
    if (!in_array($data->priority, $valid_priorities)) {
        $errors[] = 'Invalid priority. Must be one of: ' . implode(', ', $valid_priorities);
    }
}

// Return errors if validation fails
if (count($errors) > 0) {
    http_response_code(400); // Bad Request
    echo json_encode(array(
        'success' => false,
        'message' => 'Validation failed',
        'errors' => $errors
    ));
    exit();
}

// Initialize database and task model
$database = new Database();
$db = $database->connect();
$task = new Task($db);

// Set task ID
$task->id = sanitize_input($data->id);

// Check if task exists
if (!$task->read_single()) {
    http_response_code(404); // Not Found
    echo json_encode(array(
        'success' => false,
        'message' => 'Task not found'
    ));
    exit();
}

// Update task properties if provided
if (isset($data->title) && !empty($data->title)) {
    $task->title = sanitize_input($data->title);
}

if (isset($data->description)) {
    $task->description = sanitize_input($data->description);
}

if (isset($data->status)) {
    $task->status = sanitize_input($data->status);
}

if (isset($data->priority)) {
    $task->priority = sanitize_input($data->priority);
}

if (isset($data->due_date)) {
    $task->due_date = sanitize_input($data->due_date);
}

if (isset($data->assigned_to)) {
    $task->assigned_to = $data->assigned_to; // Already validated above
}

// Update the task
if ($task->update()) {
    // Get updated task details
    $task->read_single();
    
    // Create response array
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
        'assigned_to' => $task->assigned_to
    );
    
    http_response_code(200); // OK
    echo json_encode(array(
        'success' => true,
        'message' => 'Task updated',
        'data' => $task_arr
    ));
} else {
    http_response_code(500); // Server Error
    echo json_encode(array(
        'success' => false,
        'message' => 'Task not updated'
    ));
} 