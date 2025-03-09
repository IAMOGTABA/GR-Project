<?php
/**
 * Task Management System - PHP Backend
 */

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request URI
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/'; // Update this if your API is in a subdirectory

// Remove base path from the request URI
if (strpos($request_uri, $base_path) === 0) {
    $request_uri = substr($request_uri, strlen($base_path));
}

// Remove query string from the request URI
$request_uri = strtok($request_uri, '?');

// Route the request
$routes = [
    'api/auth/login' => 'api/auth/login.php',
    'api/auth/register' => 'api/auth/register.php',
    'api/users' => 'api/users/read.php',
    'api/users/create' => 'api/users/create.php',
    'api/users/update' => 'api/users/update.php',
    'api/users/delete' => 'api/users/delete.php',
    'api/tasks' => 'api/tasks/read.php',
    'api/tasks/create' => 'api/tasks/create.php',
    'api/tasks/update' => 'api/tasks/update.php',
    'api/tasks/delete' => 'api/tasks/delete.php',
];

// Check if the route exists
$found = false;
foreach ($routes as $route => $file) {
    if ($request_uri === $route || strpos($request_uri, $route . '/') === 0) {
        $found = true;
        if (file_exists($file)) {
            require_once $file;
        } else {
            http_response_code(404);
            echo json_encode([
                'success' => false,
                'message' => 'API endpoint file not found: ' . $file
            ]);
        }
        break;
    }
}

// If no route is found, return the API information
if (!$found) {
    // Default response - API information
    $response = [
        'success' => true,
        'message' => 'Task Management System API is running',
        'version' => '1.0.0',
        'php_version' => phpversion(),
        'mysql_version' => extension_loaded('mysqli') ? mysqli_get_client_info() : 'Not available',
        'endpoints' => [
            'auth' => [
                'login' => '/api/auth/login',
                'register' => '/api/auth/register'
            ],
            'users' => [
                'read' => '/api/users',
                'single' => '/api/users/{id}',
                'create' => '/api/users/create',
                'update' => '/api/users/update',
                'delete' => '/api/users/delete'
            ],
            'tasks' => [
                'read' => '/api/tasks',
                'single' => '/api/tasks/{id}',
                'create' => '/api/tasks/create',
                'update' => '/api/tasks/update',
                'delete' => '/api/tasks/delete',
                'by_user' => '/api/tasks?user_id={user_id}',
                'by_status' => '/api/tasks?status={status}',
                'search' => '/api/tasks?search={search_term}'
            ]
        ]
    ];
    
    // Ensure JSON response is properly formatted
    http_response_code(200);
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
} 