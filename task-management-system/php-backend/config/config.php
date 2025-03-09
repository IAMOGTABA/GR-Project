<?php
/**
 * Application configuration
 */

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'task_management');
define('DB_USER', 'root');     // Change this to your MySQL username if different
define('DB_PASS', '');         // Change this to your MySQL password if needed

// JWT Configuration
define('JWT_SECRET', 'task_management_secret_key');
define('JWT_EXPIRE', 3600 * 24); // 24 hours

// Upload Configuration
define('MAX_FILE_UPLOAD', 5 * 1024 * 1024); // 5MB
define('UPLOAD_PATH', dirname(__DIR__) . '/uploads/');

// Base URL
define('BASE_URL', 'http://localhost/task-management/api');

// Time configuration
date_default_timezone_set('UTC');

// Error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Application Configuration
define('SITE_URL', 'http://localhost:8000');
define('CORS_ALLOWED_ORIGINS', '*'); 