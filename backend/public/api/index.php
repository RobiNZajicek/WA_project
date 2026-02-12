<?php
/**
 * JecnaGames API
 * Simple JSON-based backend for prototyping
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Data directory
define('DATA_DIR', __DIR__ . '/../../data/');

// Ensure data directory exists
if (!is_dir(DATA_DIR)) {
    mkdir(DATA_DIR, 0755, true);
}

// Helper functions
function loadJSON($file) {
    $path = DATA_DIR . $file;
    if (!file_exists($path)) {
        return [];
    }
    
    $fp = fopen($path, 'r');
    if (!$fp) return [];
    
    flock($fp, LOCK_SH); // Shared lock for reading
    $content = file_get_contents($path);
    flock($fp, LOCK_UN);
    fclose($fp);
    
    return json_decode($content, true) ?? [];
}

function saveJSON($file, $data) {
    $path = DATA_DIR . $file;
    
    $fp = fopen($path, 'c+'); // Create if not exists, read/write
    if (!$fp) return false;
    
    flock($fp, LOCK_EX); // Exclusive lock for writing
    ftruncate($fp, 0);
    fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    
    return true;
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

function getInput() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function generateToken($userId) {
    return base64_encode($userId . ':' . time() . ':' . bin2hex(random_bytes(16)));
}

function verifyToken($token) {
    if (!$token) return null;
    $parts = explode(':', base64_decode($token));
    if (count($parts) < 3) return null;
    return $parts[0];
}

function getAuthUser() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? '';
    if (strpos($auth, 'Bearer ') === 0) {
        $token = substr($auth, 7);
        return verifyToken($token);
    }
    return null;
}

// Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = preg_replace('#^/api/#', '', $uri);
$uri = preg_replace('#^api/#', '', $uri);
$method = $_SERVER['REQUEST_METHOD'];

// Routes
switch (true) {
    // AUTH
    case $uri === 'register' && $method === 'POST':
        $input = getInput();
        $users = loadJSON('users.json');
        
        if (empty($input['username']) || empty($input['email']) || empty($input['password'])) {
            respond(['error' => 'Missing required fields'], 400);
        }
        
        foreach ($users as $user) {
            if ($user['email'] === $input['email'] || $user['username'] === $input['username']) {
                respond(['error' => 'User already exists'], 409);
            }
        }
        
        $newUser = [
            'id' => uniqid(),
            'username' => $input['username'],
            'email' => $input['email'],
            'password' => password_hash($input['password'], PASSWORD_DEFAULT),
            'class' => $input['class'] ?? null,
            'created_at' => date('Y-m-d H:i:s'),
            'stats' => [
                'totalGames' => 0,
                'wins' => 0,
                'streak' => 0,
                'bestStreak' => 0,
                'score' => 0,
            ],
        ];
        
        $users[] = $newUser;
        saveJSON('users.json', $users);
        
        $token = generateToken($newUser['id']);
        unset($newUser['password']);
        
        respond(['user' => $newUser, 'token' => $token], 201);
        break;
        
    case $uri === 'login' && $method === 'POST':
        $input = getInput();
        $users = loadJSON('users.json');
        
        foreach ($users as $user) {
            if (($user['email'] === $input['email'] || $user['username'] === $input['email']) 
                && password_verify($input['password'], $user['password'])) {
                $token = generateToken($user['id']);
                unset($user['password']);
                respond(['user' => $user, 'token' => $token]);
            }
        }
        
        respond(['error' => 'Invalid credentials'], 401);
        break;
        
    case $uri === 'me' && $method === 'GET':
        $userId = getAuthUser();
        if (!$userId) {
            respond(['error' => 'Unauthorized'], 401);
        }
        
        $users = loadJSON('users.json');
        foreach ($users as $user) {
            if ($user['id'] === $userId) {
                unset($user['password']);
                respond($user);
            }
        }
        
        respond(['error' => 'User not found'], 404);
        break;

    // LEADERBOARD
    case $uri === 'leaderboard' && $method === 'GET':
        $users = loadJSON('users.json');
        $type = $_GET['type'] ?? 'players';
        
        if ($type === 'players') {
            usort($users, fn($a, $b) => ($b['stats']['score'] ?? 0) - ($a['stats']['score'] ?? 0));
            
            $leaderboard = array_map(function($user, $index) {
                return [
                    'rank' => $index + 1,
                    'username' => $user['username'],
                    'class' => $user['class'],
                    'score' => $user['stats']['score'] ?? 0,
                    'wins' => $user['stats']['wins'] ?? 0,
                    'streak' => $user['stats']['streak'] ?? 0,
                ];
            }, array_slice($users, 0, 50), array_keys(array_slice($users, 0, 50)));
            
            respond($leaderboard);
        } else {
            $classes = [];
            foreach ($users as $user) {
                $class = $user['class'] ?? 'Unknown';
                if (!isset($classes[$class])) {
                    $classes[$class] = ['totalScore' => 0, 'players' => 0];
                }
                $classes[$class]['totalScore'] += $user['stats']['score'] ?? 0;
                $classes[$class]['players']++;
            }
            
            $classLeaderboard = [];
            foreach ($classes as $className => $data) {
                $classLeaderboard[] = [
                    'class' => $className,
                    'totalScore' => $data['totalScore'],
                    'avgScore' => $data['players'] > 0 ? round($data['totalScore'] / $data['players']) : 0,
                    'players' => $data['players'],
                ];
            }
            
            usort($classLeaderboard, fn($a, $b) => $b['avgScore'] - $a['avgScore']);
            
            foreach ($classLeaderboard as $i => &$cls) {
                $cls['rank'] = $i + 1;
            }
            
            respond($classLeaderboard);
        }
        break;

    // GAME SCORES
    case $uri === 'scores' && $method === 'POST':
        $userId = getAuthUser();
        $input = getInput();
        
        $score = [
            'id' => uniqid(),
            'user_id' => $userId,
            'game' => $input['game'],
            'won' => $input['won'] ?? false,
            'score' => $input['score'] ?? 0,
            'details' => $input['details'] ?? [],
            'created_at' => date('Y-m-d H:i:s'),
        ];
        
        $scores = loadJSON('scores.json');
        $scores[] = $score;
        saveJSON('scores.json', $scores);
        
        if ($userId) {
            $users = loadJSON('users.json');
            foreach ($users as &$user) {
                if ($user['id'] === $userId) {
                    $user['stats']['totalGames']++;
                    $user['stats']['score'] += $input['score'] ?? 0;
                    
                    if ($input['won']) {
                        $user['stats']['wins']++;
                        $user['stats']['streak']++;
                        if ($user['stats']['streak'] > $user['stats']['bestStreak']) {
                            $user['stats']['bestStreak'] = $user['stats']['streak'];
                        }
                    } else {
                        $user['stats']['streak'] = 0;
                    }
                    break;
                }
            }
            saveJSON('users.json', $users);
        }
        
        respond($score, 201);
        break;
        
    case $uri === 'scores' && $method === 'GET':
        $userId = getAuthUser();
        if (!$userId) {
            respond(['error' => 'Unauthorized'], 401);
        }
        
        $scores = loadJSON('scores.json');
        $userScores = array_filter($scores, fn($s) => $s['user_id'] === $userId);
        
        respond(array_values($userScores));
        break;

    // DAILY CHALLENGE STATUS
    case $uri === 'daily' && $method === 'GET':
        $userId = getAuthUser();
        $today = date('Y-m-d');
        $scores = loadJSON('scores.json');
        
        $games = ['wordJecna', 'connections', 'fixCode', 'crossRoute'];
        $status = [];
        
        foreach ($games as $game) {
            $played = false;
            if ($userId) {
                foreach ($scores as $score) {
                    if ($score['user_id'] === $userId 
                        && $score['game'] === $game 
                        && strpos($score['created_at'], $today) === 0) {
                        $played = true;
                        break;
                    }
                }
            }
            $status[$game] = ['played' => $played];
        }
        
        respond($status);
        break;

    default:
        respond(['error' => 'Not found', 'uri' => $uri], 404);
}
