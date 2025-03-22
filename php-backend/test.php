<?php
// Set appropriate CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

// Create a simple response
$response = [
    'success' => true,
    'message' => 'PHP backend is working',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => PHP_VERSION
];

// Output as JSON
echo json_encode($response, JSON_PRETTY_PRINT);
?> 