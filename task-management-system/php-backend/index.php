<?php
/**
 * Task Management System - PHP Backend
 */

// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Custom error handler
function apiErrorHandler($errno, $errstr, $errfile, $errline) {
    $response = array(
        'success' => false,
        'message' => 'Server error occurred',
        'error' => array(
            'type' => $errno,
            'message' => $errstr,
            'file' => $errfile,
            'line' => $errline
        )
    );
    
    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit();
}

// Set custom error handler for non-fatal errors
set_error_handler('apiErrorHandler', E_ALL & ~E_NOTICE & ~E_WARNING);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get request URI and method
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Debug logging
error_log("Original Request URI: " . $uri);
error_log("Request Method: " . $method);
error_log("Server Variables: " . print_r($_SERVER, true));
error_log("Headers: " . print_r(getallheaders(), true));

// Remove query string from URI
$uri = strtok($uri, '?');
error_log("URI after removing query string: " . $uri);

// Remove .php extension if present
$uri = preg_replace('/\.php$/', '', $uri);
error_log("URI after removing .php extension: " . $uri);

// Define routes
$routes = [
    '/' => function() {
        return [
            'success' => true,
            'message' => 'Task Management System API is running',
            'version' => '1.0.0',
            'endpoints' => [
                '/api/auth/login' => 'POST - Login endpoint',
                '/api/tasks' => 'GET - List all tasks',
                '/api/tasks/:id' => 'GET - Get task by ID',
                '/api/users' => 'GET - List all users'
            ],
            'timestamp' => date('Y-m-d H:i:s'),
            'php_version' => PHP_VERSION
        ];
    },
    '/api/tasks' => function() {
        error_log("Handling /api/tasks route");
        
        // Get headers for debugging
        $headers = getallheaders();
        error_log("Request Headers: " . print_r($headers, true));
        
        // Static tasks data for testing
        $tasks = [
            [
                'id' => 1,
                'title' => 'Complete project documentation',
                'description' => 'Write detailed documentation for the new task management system',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => '2024-06-15',
                'assigned_to' => 'John Doe',
                'created_by' => 'Admin User',
                'created_at' => '2024-06-01'
            ],
            [
                'id' => 2,
                'title' => 'Fix login page bug',
                'description' => 'There is an issue with the login form validation',
                'status' => 'in-progress',
                'priority' => 'medium',
                'due_date' => '2024-06-10',
                'assigned_to' => 'John Doe',
                'created_by' => 'Admin User',
                'created_at' => '2024-06-02'
            ]
        ];
        
        $response = [
            'success' => true,
            'message' => 'Tasks retrieved successfully',
            'count' => count($tasks),
            'data' => $tasks
        ];
        
        error_log("Sending response: " . json_encode($response));
        return $response;
    }
];

// Debug logging
error_log("Available routes: " . implode(', ', array_keys($routes)));

// Find matching route
$matched = false;
foreach ($routes as $route => $handler) {
    error_log("Checking route: " . $route);
    if ($uri === $route) {
        error_log("Route matched: " . $route);
        $matched = true;
        $response = $handler();
        echo json_encode($response);
        break;
    }
}

// Handle not found
if (!$matched) {
    error_log("No route matched for URI: " . $uri);
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Endpoint not found',
        'uri' => $uri,
        'method' => $method,
        'available_routes' => array_keys($routes)
    ]);
}

// Handle any uncaught exceptions
function handleUncaughtException($e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode(array(
        'success' => false,
        'message' => 'Uncaught exception: ' . $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ), JSON_PRETTY_PRINT);
}

set_exception_handler('handleUncaughtException');

// Return debug information
echo json_encode([
    'success' => true,
    'message' => 'Debug information',
    'request' => [
        'uri' => $uri,
        'method' => $method,
        'headers' => getallheaders(),
        'server' => $_SERVER
    ]
]);
?> 