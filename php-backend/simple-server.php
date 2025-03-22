<?php
/**
 * Simple PHP Server for testing
 */

// Set appropriate headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Basic routing
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string if any
$request_uri = strtok($request_uri, '?');

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
            '/test' => 'GET - Test endpoint'
        ]
    ]);
} 
else if ($request_uri == '/test') {
    // Test endpoint
    echo json_encode([
        'success' => true,
        'message' => 'Test endpoint working!',
        'timestamp' => date('Y-m-d H:i:s'),
        'method' => $method
    ]);
}
else if ($request_uri == '/api/auth/login' && $method == 'POST') {
    // Login endpoint
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Simple validation
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Email and password are required'
        ]);
        exit();
    }
    
    // Demo authentication
    if (($data['email'] === 'admin@example.com' && $data['password'] === 'admin123') || 
        ($data['email'] === 'employee@example.com' && $data['password'] === 'employee123')) {
        
        $role = ($data['email'] === 'admin@example.com') ? 'admin' : 'employee';
        $name = ($data['email'] === 'admin@example.com') ? 'Admin User' : 'Regular Employee';
        
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'token' => 'demo-token-' . time(),
                'user' => [
                    'email' => $data['email'],
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
}
else if ($request_uri == '/api/tasks' && $method == 'GET') {
    // Tasks endpoint
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
}
else {
    // 404 Not Found
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Endpoint not found: ' . $request_uri
    ]);
}
?> 