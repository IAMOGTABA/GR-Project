<?php
require_once __DIR__ . '/../config/database.php';

class User {
    // DB connection
    private $conn;
    private $table = 'users';

    // User properties
    public $id;
    public $name;
    public $email;
    public $password;
    public $role;
    public $department;
    public $position;
    public $phone;
    public $avatar;
    public $reset_password_token;
    public $reset_password_expire;
    public $created_at;
    public $updated_at;

    /**
     * Constructor with DB connection
     */
    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    /**
     * Get all users
     */
    public function getAll() {
        $query = "SELECT 
                id, name, email, role, department, position, phone, avatar, created_at, updated_at
            FROM 
                {$this->table}
            ORDER BY
                created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    /**
     * Get single user
     */
    public function getById() {
        $query = "SELECT 
                id, name, email, role, department, position, phone, avatar, created_at, updated_at
            FROM 
                {$this->table}
            WHERE 
                id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch();
        
        if($row) {
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->role = $row['role'];
            $this->department = $row['department'];
            $this->position = $row['position'];
            $this->phone = $row['phone'];
            $this->avatar = $row['avatar'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            
            return true;
        }
        
        return false;
    }

    /**
     * Create user
     */
    public function create() {
        $query = "INSERT INTO {$this->table}
            (name, email, password, role, department, position, phone, avatar) 
            VALUES
            (:name, :email, :password, :role, :department, :position, :phone, :avatar)";
            
        $stmt = $this->conn->prepare($query);
        
        // Clean and secure data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->department = htmlspecialchars(strip_tags($this->department));
        $this->position = htmlspecialchars(strip_tags($this->position));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->avatar = htmlspecialchars(strip_tags($this->avatar));
        
        // Hash password
        $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        
        // Bind parameters
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':department', $this->department);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':avatar', $this->avatar);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        
        return false;
    }

    /**
     * Update user
     */
    public function update() {
        $query = "UPDATE {$this->table}
            SET
                name = :name,
                email = :email,
                role = :role,
                department = :department,
                position = :position,
                phone = :phone,
                avatar = :avatar
            WHERE
                id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        // Clean and secure data
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->department = htmlspecialchars(strip_tags($this->department));
        $this->position = htmlspecialchars(strip_tags($this->position));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->avatar = htmlspecialchars(strip_tags($this->avatar));
        
        // Bind parameters
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':department', $this->department);
        $stmt->bindParam(':position', $this->position);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':avatar', $this->avatar);
        
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    /**
     * Delete user
     */
    public function delete() {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        $stmt->bindParam(':id', $this->id);
        
        if($stmt->execute()) {
            return true;
        }
        
        return false;
    }

    /**
     * Get user by email
     */
    public function getByEmail() {
        $query = "SELECT 
                id, name, email, password, role, department, position, phone, avatar, created_at, updated_at
            FROM 
                {$this->table}
            WHERE 
                email = :email";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $this->email);
        $stmt->execute();
        
        $row = $stmt->fetch();
        
        if($row) {
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->department = $row['department'];
            $this->position = $row['position'];
            $this->phone = $row['phone'];
            $this->avatar = $row['avatar'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            
            return true;
        }
        
        return false;
    }

    /**
     * Verify password
     */
    public function verifyPassword($password) {
        return password_verify($password, $this->password);
    }
} 