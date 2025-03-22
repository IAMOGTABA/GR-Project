<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json');

// Static tasks data
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

// Return tasks
echo json_encode([
    'success' => true,
    'message' => 'Tasks retrieved successfully',
    'count' => count($tasks),
    'data' => $tasks
]); 