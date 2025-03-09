<?php
// Include database class
include_once 'config/database.php';

// Set headers
header('Content-Type: application/json');

// Create database object and connect
$database = new Database();
$db = $database->connect();

// Test connection
if($db) {
    // Try to query the database
    try {
        // Check if the tables exist
        $stmt = $db->prepare("SHOW TABLES");
        $stmt->execute();
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo json_encode(array(
            'success' => true,
            'message' => 'MySQL database connection successful',
            'tables' => $tables,
            'db_name' => DB_NAME,
            'server_info' => $db->getAttribute(PDO::ATTR_SERVER_INFO)
        ));
    } catch(PDOException $e) {
        echo json_encode(array(
            'success' => false,
            'message' => 'Database query failed: ' . $e->getMessage()
        ));
    }
} else {
    echo json_encode(array(
        'success' => false,
        'message' => 'Database connection failed'
    ));
} 