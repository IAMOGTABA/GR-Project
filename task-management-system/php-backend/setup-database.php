<?php
// Include database class and config
include_once 'config/database.php';

// Set headers
header('Content-Type: application/json');

// Function to execute SQL from file
function execute_sql_file($pdo, $sql_file) {
    try {
        // Check if file exists
        if (!file_exists($sql_file)) {
            return array(
                'success' => false,
                'message' => 'SQL file not found: ' . $sql_file
            );
        }

        // Read SQL file
        $sql = file_get_contents($sql_file);
        
        // Split SQL by semicolon to get individual queries
        $queries = explode(';', $sql);
        
        // Execute each query
        foreach ($queries as $query) {
            $query = trim($query);
            if (!empty($query)) {
                $pdo->exec($query);
            }
        }
        
        return array(
            'success' => true,
            'message' => 'SQL file executed successfully'
        );
    } catch(PDOException $e) {
        return array(
            'success' => false,
            'message' => 'Error executing SQL: ' . $e->getMessage(),
            'query' => isset($query) ? $query : 'Unknown'
        );
    }
}

// Create database connection
try {
    // Connect without database name first to create database if not exists
    $pdo = new PDO('mysql:host=' . DB_HOST, DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
    
    // Switch to the database
    $pdo->exec("USE " . DB_NAME);
    
    // Execute SQL file
    $result = execute_sql_file($pdo, 'config/schema.sql');
    
    if ($result['success']) {
        // Connect to database to check tables
        $database = new Database();
        $db = $database->connect();
        
        // Check tables
        $stmt = $db->prepare("SHOW TABLES");
        $stmt->execute();
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo json_encode(array(
            'success' => true,
            'message' => 'Database setup completed successfully',
            'tables' => $tables
        ));
    } else {
        echo json_encode($result);
    }
} catch(PDOException $e) {
    echo json_encode(array(
        'success' => false,
        'message' => 'Database setup failed: ' . $e->getMessage()
    ));
} 