<?php
/**
 * Task Management System API - Entry Point
 * This file serves as the entry point for all API requests
 */

// Error handling
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set CORS headers to allow all origins
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Simple router
if ($request_uri == '/' || $request_uri == '') {
    // Root path - API info
    echo json_encode([
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
    ], JSON_PRETTY_PRINT);
    exit();
}

// Auth endpoints
if ($request_uri == '/api/auth/login' && $method == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Email and password are required'
        ]);
        exit();
    }
    
    $email = $data['email'];
    $password = $data['password'];
    
    if (($email == 'admin@example.com' && $password == 'admin123') || 
        ($email == 'employee@example.com' && $password == 'employee123')) {
        
        $role = ($email == 'admin@example.com') ? 'admin' : 'employee';
        $name = ($email == 'admin@example.com') ? 'Admin User' : 'Regular Employee';
        
        $token = 'demo-token-' . base64_encode($email . ':' . time());
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => $token,
                'user' => [
                    'email' => $email,
                    'name' => $name,
                    'role' => $role
                ]
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
    }
    exit();
}

// Tasks endpoints
if ($request_uri == '/api/tasks' && $method == 'GET') {
    $tasks = [
        [
            'id' => 1,
            'title' => 'Complete project documentation',
            'description' => 'Write detailed documentation for the new task management system',
            'status' => 'pending',
            'priority' => 'high',
            'dueDate' => '2023-06-15',
            'assignedTo' => 'John Doe',
            'createdBy' => 'Admin User',
            'createdAt' => '2023-06-01'
        ],
        [
            'id' => 2,
            'title' => 'Fix login page bug',
            'description' => 'There is an issue with the login form validation',
            'status' => 'in-progress',
            'priority' => 'medium',
            'dueDate' => '2023-06-10',
            'assignedTo' => 'John Doe',
            'createdBy' => 'Admin User',
            'createdAt' => '2023-06-02'
        ],
        [
            'id' => 3,
            'title' => 'Design new dashboard',
            'description' => 'Create wireframes for the new admin dashboard',
            'status' => 'overdue',
            'priority' => 'high',
            'dueDate' => '2023-06-05',
            'assignedTo' => 'Jane Smith',
            'createdBy' => 'Admin User',
            'createdAt' => '2023-06-01'
        ],
        [
            'id' => 4,
            'title' => 'Update user profile page',
            'description' => 'Add new fields to the user profile form',
            'status' => 'completed',
            'priority' => 'low',
            'dueDate' => '2023-06-08',
            'assignedTo' => 'John Doe',
            'createdBy' => 'Admin User',
            'completedAt' => '2023-06-07',
            'createdAt' => '2023-06-03'
        ]
    ];
    
    echo json_encode([
        'success' => true,
        'message' => 'Tasks retrieved successfully',
        'data' => $tasks
    ]);
    exit();
}

// Users endpoints
if ($request_uri == '/api/users' && $method == 'GET') {
    $users = [
        [
            'id' => 1,
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin'
        ],
        [
            'id' => 2,
            'name' => 'Regular Employee',
            'email' => 'employee@example.com',
            'role' => 'employee'
        ],
        [
            'id' => 3,
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'role' => 'employee'
        ],
        [
            'id' => 4,
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'role' => 'employee'
        ]
    ];
    
    echo json_encode([
        'success' => true,
        'message' => 'Users retrieved successfully',
        'data' => $users
    ]);
    exit();
}

// Task update endpoint (simple implementation)
if (preg_match('/^\/api\/tasks\/update\/(\d+)$/', $request_uri, $matches) && $method == 'PUT') {
    $id = $matches[1];
    $data = json_decode(file_get_contents('php://input'), true);
    
    echo json_encode([
        'success' => true,
        'message' => 'Task updated successfully',
        'data' => array_merge(['id' => intval($id)], $data)
    ]);
    exit();
}

// 404 Not Found - if no endpoint matched
http_response_code(404);
echo json_encode([
    'success' => false,
    'message' => 'Endpoint not found: ' . $request_uri,
    'method' => $method
]);
?> 