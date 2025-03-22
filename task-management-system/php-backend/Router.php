<?php
class Router {
    private $routes = array();
    private $basePath = '';

    public function __construct($basePath = '') {
        $this->basePath = $basePath;
    }

    public function addRoute($method, $path, $handler) {
        $this->routes[] = array(
            'method' => $method,
            'path' => $this->basePath . $path,
            'handler' => $handler
        );
    }

    public function handleRequest() {
        $uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];

        // Remove query string
        $uri = strtok($uri, '?');

        // Remove .php extension if present
        $uri = preg_replace('/\.php$/', '', $uri);

        // Handle tasks endpoint
        if ($uri === '/api/tasks' && $method === 'GET') {
            include 'api/tasks/read.php';
            return;
        }

        // Handle login endpoint
        if ($uri === '/api/auth/login' && $method === 'POST') {
            include 'api/auth/login.php';
            return;
        }

        // Default response
        http_response_code(404);
        echo json_encode(array(
            'success' => false,
            'message' => 'Endpoint not found',
            'path' => $uri,
            'method' => $method
        ));
    }
} 