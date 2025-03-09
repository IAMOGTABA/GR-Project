<?php
/**
 * User Model
 */
class User {
    // Database connection and table name
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
     * Constructor with DB
     * 
     * @param PDO $db Database connection
     */
    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all users
     * 
     * @return PDOStatement
     */
    public function read() {
        // Create query
        $query = 'SELECT 
                    id, 
                    name, 
                    email, 
                    role, 
                    avatar, 
                    created_at 
                FROM ' . $this->table . ' 
                ORDER BY created_at DESC';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Execute query
        $stmt->execute();

        return $stmt;
    }

    /**
     * Get single user by ID
     * 
     * @return bool True if user found, false otherwise
     */
    public function read_single() {
        // Create query
        $query = 'SELECT 
                    id, 
                    name, 
                    email, 
                    role, 
                    avatar, 
                    created_at 
                FROM ' . $this->table . ' 
                WHERE id = :id 
                LIMIT 0,1';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(':id', $this->id);

        // Execute query
        $stmt->execute();

        // Check if user exists
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Set properties
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->role = $row['role'];
            $this->avatar = $row['avatar'];
            $this->created_at = $row['created_at'];

            return true;
        }

        return false;
    }

    /**
     * Create user
     * 
     * @return bool
     */
    public function create() {
        // Create query
        $query = 'INSERT INTO ' . $this->table . ' 
                SET 
                    name = :name, 
                    email = :email, 
                    password = :password, 
                    role = :role, 
                    avatar = :avatar';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->avatar = $this->avatar ? htmlspecialchars(strip_tags($this->avatar)) : null;

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':avatar', $this->avatar);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    /**
     * Update user
     * 
     * @return bool
     */
    public function update() {
        // Create query
        $query = 'UPDATE ' . $this->table . ' 
                SET 
                    name = :name, 
                    email = :email,
                    role = :role, 
                    avatar = :avatar';
        
        // Add password to query if set
        if(!empty($this->password)) {
            $query .= ', password = :password';
        }
        
        $query .= ' WHERE id = :id';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->role = htmlspecialchars(strip_tags($this->role));
        $this->avatar = $this->avatar ? htmlspecialchars(strip_tags($this->avatar)) : null;
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':role', $this->role);
        $stmt->bindParam(':avatar', $this->avatar);
        $stmt->bindParam(':id', $this->id);

        // Bind password if set
        if(!empty($this->password)) {
            $stmt->bindParam(':password', $this->password);
        }

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    /**
     * Delete user
     * 
     * @return bool
     */
    public function delete() {
        // Create query
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Bind data
        $stmt->bindParam(':id', $this->id);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    /**
     * Get user by email
     * 
     * @return bool True if user found, false otherwise
     */
    public function get_by_email() {
        // Create query
        $query = 'SELECT 
                    id, 
                    name, 
                    email, 
                    password, 
                    role, 
                    avatar, 
                    created_at 
                FROM ' . $this->table . ' 
                WHERE email = :email 
                LIMIT 0,1';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->email = htmlspecialchars(strip_tags($this->email));

        // Bind data
        $stmt->bindParam(':email', $this->email);

        // Execute query
        $stmt->execute();

        // Check if user exists
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Set properties
            $this->id = $row['id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->password = $row['password'];
            $this->role = $row['role'];
            $this->avatar = $row['avatar'];
            $this->created_at = $row['created_at'];

            return true;
        }

        return false;
    }

    /**
     * Check if email exists
     * 
     * @param string $email Email to check
     * @return bool True if email exists, false otherwise
     */
    public function email_exists($email = null) {
        if($email) {
            $this->email = $email;
        }
        
        // Create query
        $query = 'SELECT id FROM ' . $this->table . ' WHERE email = :email LIMIT 0,1';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->email = htmlspecialchars(strip_tags($this->email));

        // Bind data
        $stmt->bindParam(':email', $this->email);

        // Execute query
        $stmt->execute();

        // Return true if email exists
        return $stmt->rowCount() > 0;
    }

    /**
     * Verify password
     */
    public function verifyPassword($password) {
        return password_verify($password, $this->password);
    }
} 