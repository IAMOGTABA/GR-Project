<?php
require_once __DIR__ . '/../config/config.php';

class JWT {
    /**
     * Generate JWT token
     * 
     * @param array $payload Data to encode in the token
     * @return string JWT token
     */
    public static function generate($payload) {
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);
        
        $payload['exp'] = time() + JWT_EXPIRE;
        $payload = json_encode($payload);
        
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    /**
     * Validate JWT token
     * 
     * @param string $token JWT token to validate
     * @return array|bool Decoded payload or false if invalid
     */
    public static function validate($token) {
        $parts = explode('.', $token);
        
        if(count($parts) != 3) {
            return false;
        }
        
        list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $parts;
        
        $signature = base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlSignature));
        
        $rawSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        
        if(!hash_equals($signature, $rawSignature)) {
            return false;
        }
        
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64UrlPayload)), true);
        
        if($payload['exp'] < time()) {
            return false;
        }
        
        return $payload;
    }
} 