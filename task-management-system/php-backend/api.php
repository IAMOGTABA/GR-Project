<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request path
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Debug logging
error_log("Request URI: " . $request_uri);
error_log("Path: " . $path);
error_log("Method: " . $method);

// Handle API requests
if (strpos($path, '/api/') === 0) {
    // Remove /api prefix
    $path = substr($path, 4);

    // Handle routes
    switch ($path) {
        case '/tasks':
            if ($method === 'GET') {
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
            } else {
                http_response_code(405);
                echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
            }
            break;

        case '/auth/login':
            if ($method === 'POST') {
                require __DIR__ . '/api/auth/login.php';
            } else {
                http_response_code(405);
                echo json_encode(array('success' => false, 'message' => 'Method not allowed'));
            }
            break;

        default:
            http_response_code(404);
            echo json_encode(array(
                'success' => false,
                'message' => 'Endpoint not found',
                'path' => $path,
                'method' => $method
            ));
            break;
    }
} else {
    // Root endpoint - show API info
    echo json_encode(array(
        'success' => true,
        'message' => 'Task Management System API is running',
        'version' => '1.0.0',
        'endpoints' => array(
            '/api/auth/login' => 'POST - Login endpoint',
            '/api/tasks' => 'GET - List all tasks',
            '/api/tasks/:id' => 'GET - Get task by ID',
            '/api/users' => 'GET - List all users'
        ),
        'php_version' => phpversion(),
        'timestamp' => date('Y-m-d H:i:s')
    ));
} 