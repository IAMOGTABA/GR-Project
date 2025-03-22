<?php
/**
 * Read tasks endpoint
 */

// Allow only GET requests for reading tasks
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Only GET is accepted.'
    ]);
    exit();
}

// Demo data - in a real app, this would come from a database
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

// Filter tasks if status parameter is provided
if (isset($_GET['status']) && !empty($_GET['status'])) {
    $status = $_GET['status'];
    $filteredTasks = array_filter($tasks, function($task) use ($status) {
        return $task['status'] === $status;
    });
    $tasks = array_values($filteredTasks); // Reset array keys
}

// Filter tasks if user_id parameter is provided
if (isset($_GET['user_id']) && !empty($_GET['user_id'])) {
    $userId = $_GET['user_id'];
    // In a real app, you would filter by user ID
    // For demo, we'll just return the tasks as is
}

// Return success response with tasks
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Tasks retrieved successfully',
    'data' => $tasks
]);
?> 