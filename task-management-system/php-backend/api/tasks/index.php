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

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Get request URI
$uri = $_SERVER['REQUEST_URI'];

// Debug logging
error_log("Request URI: " . $uri);
error_log("Request Method: " . $method);

// Handle different HTTP methods
switch ($method) {
    case 'GET':
        // Include read.php for GET requests
        require_once 'read.php';
        break;
        
    case 'POST':
        // Include create.php for POST requests
        require_once 'create.php';
        break;
        
    case 'PUT':
        // Include update.php for PUT requests
        require_once 'update.php';
        break;
        
    case 'DELETE':
        // Include delete.php for DELETE requests
        require_once 'delete.php';
        break;
        
    default:
        http_response_code(405);
        echo json_encode([
            'success' => false,
            'message' => 'Method not allowed'
        ]);
        break;
} 