<?php
/**
 * Update task endpoint
 */

// Allow only PUT requests for updating tasks
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only PUT is accepted.'
    ]);
    exit();
}

// Get the ID from the URL
$url_parts = explode('/', $_SERVER['REQUEST_URI']);
$id = end($url_parts);

// Ensure ID is valid
if (!is_numeric($id)) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => 'Invalid task ID.'
    ]);
    exit();
}

// Get the posted data
$data = json_decode(file_get_contents('php://input'), true);

// In a real app, you would update the task in the database
// For demo, we'll just return a success response

// Return success response with updated task
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Task updated successfully',
    'data' => array_merge(['id' => intval($id)], $data)
]);
?> 