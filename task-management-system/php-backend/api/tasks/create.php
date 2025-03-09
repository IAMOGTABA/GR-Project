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

// Check if required fields are provided
if(
    !isset($data->title) || 
    !isset($data->description) || 
    !isset($data->due_date)
) {
    $response['message'] = 'Title, description and due date are required';
    echo json_encode($response);
    exit();
}

// Create task object
$task = new Task();

// Set task properties
$task->title = $data->title;
$task->description = $data->description;
$task->status = isset($data->status) ? $data->status : 'todo';
$task->priority = isset($data->priority) ? $data->priority : 'medium';
$task->category = isset($data->category) ? $data->category : null;
$task->assigned_to = isset($data->assigned_to) ? $data->assigned_to : [];
$task->assigned_by = $auth_user['id'];
$task->start_date = date('Y-m-d H:i:s');
$task->due_date = $data->due_date;

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
} else {
    $response['message'] = 'Task creation failed';
}

// Return response
echo json_encode($response); 