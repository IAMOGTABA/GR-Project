<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include files
require_once '../../includes/Task.php';
require_once '../../includes/authenticate.php';

// Authenticate user
$auth_user = authenticate();

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Initialize response
$response = array(
    'success' => false,
    'message' => '',
    'data' => null
);

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

// Validate inputs
$errors = [];

// Check if required fields are provided
if (!isset($data->title) || empty(trim($data->title))) {
    $errors[] = 'Title is required';
}

if (!isset($data->description) || empty(trim($data->description))) {
    $errors[] = 'Description is required';
}

if (!isset($data->due_date) || empty(trim($data->due_date))) {
    $errors[] = 'Due date is required';
} else {
    // Validate date format
    $due_date = $data->due_date;
    if (!preg_match('/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/', $due_date)) {
        $errors[] = 'Due date must be in YYYY-MM-DD or YYYY-MM-DD HH:MM:SS format';
    }
}

// Return errors if validation fails
if (count($errors) > 0) {
    $response['success'] = false;
    $response['message'] = 'Validation failed';
    $response['data'] = $errors;
    http_response_code(400);
    echo json_encode($response);
    exit();
}

// Create task object
$task = new Task();

// Set task properties with sanitized values
$task->title = sanitize_input($data->title);
$task->description = sanitize_input($data->description);
$task->status = isset($data->status) ? sanitize_input($data->status) : 'todo';
$task->priority = isset($data->priority) ? sanitize_input($data->priority) : 'medium';
$task->category = isset($data->category) ? sanitize_input($data->category) : null;
$task->assigned_to = isset($data->assigned_to) ? $data->assigned_to : [];
$task->assigned_by = $auth_user['id'];
$task->start_date = date('Y-m-d H:i:s');
$task->due_date = sanitize_input($data->due_date);

// Create task
if($task->create()) {
    $response['success'] = true;
    $response['message'] = 'Task created successfully';
    
    // Get the created task
    $task->id = $task->id;
    $task->getById();
    
    $response['data'] = array(
        'id' => $task->id,
        'title' => $task->title,
        'description' => $task->description,
        'status' => $task->status,
        'priority' => $task->priority,
        'category' => $task->category,
        'assigned_to' => $task->assigned_to,
        'assigned_by' => $task->assigned_by,
        'start_date' => $task->start_date,
        'due_date' => $task->due_date,
        'completed_date' => $task->completed_date,
        'created_at' => $task->created_at,
        'updated_at' => $task->updated_at
    );
    
    http_response_code(201); // Created
} else {
    $response['message'] = 'Task creation failed';
    http_response_code(500); // Server error
}

// Return response
echo json_encode($response); 