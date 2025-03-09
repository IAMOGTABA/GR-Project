<?php
/**
 * JWT Utility Class
 */
class JWT {
    private $secret;
    private $expiry;

    /**
     * Constructor
     */
    public function __construct() {
        // Load config
        require_once __DIR__ . '/../config/config.php';
        
        $this->secret = JWT_SECRET;
        $this->expiry = JWT_EXPIRE;
    }

    /**
     * Generate JWT token
     * 
     * @param array $payload Data to encode in the token
     * @return string Generated JWT token
     */
    public function generate($payload) {
        // Create token header
        $header = json_encode([
            'typ' => 'JWT',
            'alg' => 'HS256'
        ]);

        // Add expiry time to payload
        $payload['exp'] = time() + $this->expiry;
        
        // Encode header and payload
        $base64UrlHeader = $this->base64UrlEncode($header);
        $base64UrlPayload = $this->base64UrlEncode(json_encode($payload));
        
        // Create signature
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $this->secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        // Create JWT
        $jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
        
        return $jwt;
    }

    /**
     * Validate JWT token
     * 
     * @param string $token JWT token to validate
     * @return bool True if valid, false otherwise
     */
    public function validate($token) {
        // Split token into parts
        $tokenParts = explode('.', $token);
        
        if (count($tokenParts) != 3) {
            return false;
        }
        
        $header = $tokenParts[0];
        $payload = $tokenParts[1];
        $signatureProvided = $tokenParts[2];
        
        // Check signature
        $signature = hash_hmac('sha256', $header . "." . $payload, $this->secret, true);
        $base64UrlSignature = $this->base64UrlEncode($signature);
        
        if ($base64UrlSignature !== $signatureProvided) {
            return false;
        }
        
        // Check if token is expired
        $decodedPayload = json_decode($this->base64UrlDecode($payload));
        
        if (!isset($decodedPayload->exp) || $decodedPayload->exp < time()) {
            return false;
        }
        
        return true;
    }

    /**
     * Decode JWT token payload
     * 
     * @param string $token JWT token to decode
     * @return object Decoded payload
     */
    public function decode($token) {
        $tokenParts = explode('.', $token);
        
        if (count($tokenParts) != 3) {
            return null;
        }
        
        $payload = $tokenParts[1];
        return json_decode($this->base64UrlDecode($payload));
    }

    /**
     * Base64Url encode
     * 
     * @param string $data Data to encode
     * @return string Encoded data
     */
    private function base64UrlEncode($data) {
        $base64 = base64_encode($data);
        $base64Url = strtr($base64, '+/', '-_');
        return rtrim($base64Url, '=');
    }

    /**
     * Base64Url decode
     * 
     * @param string $data Data to decode
     * @return string Decoded data
     */
    private function base64UrlDecode($data) {
        $base64Url = strtr($data, '-_', '+/');
        $base64 = str_pad($base64Url, strlen($data) % 4, '=', STR_PAD_RIGHT);
        return base64_decode($base64);
    }
} 