<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Get request details
$request = array(
    'uri' => $_SERVER['REQUEST_URI'],
    'method' => $_SERVER['REQUEST_METHOD'],
    'headers' => getallheaders(),
);

// Log request details
error_log("Request Details: " . print_r($request, true));

// Basic auth check function
function checkAuth() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No authorization token provided']);
        return false;
    }
    
    $auth = $headers['Authorization'];
    if ($auth !== 'Bearer demo-token') {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid authorization token']);
        return false;
    }
    
    return true;
}

// Define routes
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string from URI if present
$uri = strtok($uri, '?');

// Define routes
switch ($uri) {
    case '/':
        header('Content-Type: application/json');
        $response = [
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
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        break;

    case '/api/auth/login':
        header('Content-Type: application/json');
        if ($method !== 'POST') {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed'], JSON_PRETTY_PRINT);
            break;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        if ($username === 'demo' && $password === 'demo123') {
            echo json_encode([
                'success' => true,
                'message' => 'Login successful',
                'token' => 'demo-token',
                'user' => [
                    'id' => 1,
                    'username' => 'demo',
                    'role' => 'admin'
                ]
            ], JSON_PRETTY_PRINT);
        } else {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid credentials'
            ], JSON_PRETTY_PRINT);
        }
        break;

    case '/api/tasks':
        header('Content-Type: application/json');
        if (!checkAuth()) break;
        
        if ($method === 'GET') {
            $tasks = [
                [
                    'id' => 1,
                    'title' => 'Complete project documentation',
                    'description' => 'Write comprehensive documentation for the project',
                    'status' => 'pending',
                    'due_date' => '2025-03-25',
                    'assigned_to' => 'demo'
                ],
                [
                    'id' => 2,
                    'title' => 'Review pull requests',
                    'description' => 'Review and merge pending pull requests',
                    'status' => 'completed',
                    'due_date' => '2025-03-23',
                    'assigned_to' => 'user1'
                ],
                [
                    'id' => 3,
                    'title' => 'Fix bug in login system',
                    'description' => 'Investigate and fix authentication issues',
                    'status' => 'in-progress',
                    'due_date' => '2025-03-24',
                    'assigned_to' => 'user2'
                ]
            ];
            echo json_encode(['success' => true, 'data' => $tasks], JSON_PRETTY_PRINT);
        } else if ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['title'])) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Title is required'], JSON_PRETTY_PRINT);
                break;
            }
            
            $newTask = [
                'id' => 4,
                'title' => $input['title'],
                'description' => $input['description'] ?? '',
                'status' => $input['status'] ?? 'pending',
                'due_date' => $input['due_date'] ?? date('Y-m-d'),
                'assigned_to' => $input['assigned_to'] ?? 'demo'
            ];
            echo json_encode(['success' => true, 'data' => $newTask], JSON_PRETTY_PRINT);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed'], JSON_PRETTY_PRINT);
        }
        break;

    case (preg_match('/^\/api\/tasks\/(\d+)$/', $uri, $matches) ? true : false):
        header('Content-Type: application/json');
        if (!checkAuth()) break;
        
        $taskId = $matches[1];
        if ($method === 'GET') {
            $task = [
                'id' => (int)$taskId,
                'title' => 'Sample task ' . $taskId,
                'description' => 'This is a sample task with ID ' . $taskId,
                'status' => 'pending',
                'due_date' => date('Y-m-d'),
                'assigned_to' => 'demo'
            ];
            echo json_encode(['success' => true, 'data' => $task], JSON_PRETTY_PRINT);
        } else if ($method === 'PUT') {
            $input = json_decode(file_get_contents('php://input'), true);
            $updatedTask = [
                'id' => (int)$taskId,
                'title' => $input['title'] ?? 'Sample task ' . $taskId,
                'description' => $input['description'] ?? 'This is a sample task with ID ' . $taskId,
                'status' => $input['status'] ?? 'pending',
                'due_date' => $input['due_date'] ?? date('Y-m-d'),
                'assigned_to' => $input['assigned_to'] ?? 'demo'
            ];
            echo json_encode(['success' => true, 'data' => $updatedTask], JSON_PRETTY_PRINT);
        } else if ($method === 'DELETE') {
            echo json_encode(['success' => true, 'message' => 'Task deleted successfully'], JSON_PRETTY_PRINT);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed'], JSON_PRETTY_PRINT);
        }
        break;

    case '/api/users':
        header('Content-Type: application/json');
        if (!checkAuth()) break;
        
        if ($method === 'GET') {
            $users = [
                [
                    'id' => 1,
                    'username' => 'demo',
                    'role' => 'admin',
                    'email' => 'demo@example.com',
                    'created_at' => '2025-03-01'
                ],
                [
                    'id' => 2,
                    'username' => 'user1',
                    'role' => 'user',
                    'email' => 'user1@example.com',
                    'created_at' => '2025-03-02'
                ],
                [
                    'id' => 3,
                    'username' => 'user2',
                    'role' => 'user',
                    'email' => 'user2@example.com',
                    'created_at' => '2025-03-03'
                ]
            ];
            echo json_encode(['success' => true, 'data' => $users], JSON_PRETTY_PRINT);
        } else {
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed'], JSON_PRETTY_PRINT);
        }
        break;

    default:
        header('Content-Type: application/json');
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Endpoint not found'], JSON_PRETTY_PRINT);
        break;
} 