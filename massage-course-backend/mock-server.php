<?php
// Simple API server with CORS support
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request path
$requestPath = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = strtok($requestPath, '?');

// Simple routing
if (strpos($path, '/api/test') !== false) {
    header('Content-Type: application/json');
    echo json_encode(['message' => 'CORS is working!', 'timestamp' => time()]);
    exit();
}

if (strpos($path, '/api/auth/login') !== false && $method === 'POST') {
    header('Content-Type: application/json');
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON']);
        exit();
    }
    
    if (!isset($input['email']) || !isset($input['password'])) {
        http_response_code(422);
        echo json_encode([
            'message' => 'The given data was invalid.',
            'errors' => [
                'email' => ['The email field is required.'],
                'password' => ['The password field is required.']
            ]
        ]);
        exit();
    }
    
    // Simple authentication mock
    if ($input['email'] === 'admin@example.com' && $input['password'] === 'password') {
        echo json_encode([
            'token' => 'test-token-' . time(),
            'user' => [
                'id' => 1,
                'name' => 'Test User',
                'email' => $input['email']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials']);
    }
    exit();
}

if (strpos($path, '/api/auth/register') !== false && $method === 'POST') {
    header('Content-Type: application/json');
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid JSON']);
        exit();
    }
    
    // Mock registration
    echo json_encode([
        'token' => 'test-token-' . time(),
        'user' => [
            'id' => 2,
            'name' => $input['name'] ?? 'New User',
            'email' => $input['email'] ?? 'user@example.com'
        ]
    ]);
    exit();
}

if (strpos($path, '/api') !== false) {
    header('Content-Type: application/json');
    echo json_encode(['message' => 'API endpoint not found']);
    exit();
}

if (strpos($path, '/sanctum/csrf-cookie') !== false) {
    // Mock CSRF cookie response
    setcookie('XSRF-TOKEN', 'test-csrf-token', time() + 3600, '/', 'localhost');
    http_response_code(204);
    exit();
}

// Default response
header('Content-Type: application/json');
echo json_encode(['message' => 'Mock Laravel API Server', 'status' => 'running']);
?>
