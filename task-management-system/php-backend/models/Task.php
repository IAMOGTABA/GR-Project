<?php
/**
 * Task Model
 */
class Task {
    // Database connection and table name
    private $conn;
    private $table = 'tasks';

    // Task properties
    public $id;
    public $title;
    public $description;
    public $status;
    public $priority;
    public $due_date;
    public $created_at;
    public $updated_at;
    public $created_by;
    public $assigned_to;
    public $created_by_name;
    public $assigned_to_name;

    /**
     * Constructor with DB
     * 
     * @param PDO $db Database connection
     */
    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get all tasks with optional filtering
     * 
     * @param int $user_id Filter by user id
     * @param string $status Filter by status
     * @param string $search Search term
     * @return PDOStatement
     */
    public function read($user_id = null, $status = null, $search = null) {
        // Start base query
        $query = 'SELECT 
                    t.id, 
                    t.title, 
                    t.description, 
                    t.status, 
                    t.priority, 
                    t.due_date, 
                    t.created_at, 
                    t.updated_at, 
                    t.created_by, 
                    t.assigned_to,
                    u1.name as created_by_name,
                    u2.name as assigned_to_name
                FROM ' . $this->table . ' t
                LEFT JOIN users u1 ON t.created_by = u1.id
                LEFT JOIN users u2 ON t.assigned_to = u2.id';
        
        // Add conditions based on filters
        $conditions = array();
        $params = array();
        
        if ($user_id) {
            $conditions[] = '(t.created_by = :user_id OR t.assigned_to = :user_id)';
            $params[':user_id'] = $user_id;
        }
        
        if ($status) {
            $conditions[] = 't.status = :status';
            $params[':status'] = $status;
        }
        
        if ($search) {
            $conditions[] = '(t.title LIKE :search OR t.description LIKE :search)';
            $params[':search'] = '%' . $search . '%';
        }
        
        // Add WHERE clause if conditions exist
        if (!empty($conditions)) {
            $query .= ' WHERE ' . implode(' AND ', $conditions);
        }
        
        // Add ORDER BY
        $query .= ' ORDER BY t.due_date ASC, t.priority DESC';
        
        // Prepare statement
        $stmt = $this->conn->prepare($query);
        
        // Bind parameters
        foreach ($params as $param => $value) {
            $stmt->bindValue($param, $value);
        }
        
        // Execute query
        $stmt->execute();
        
        return $stmt;
    }

    /**
     * Get single task
     * 
     * @return bool True if task found, false otherwise
     */
    public function read_single() {
        // Create query
        $query = 'SELECT 
                    t.id, 
                    t.title, 
                    t.description, 
                    t.status, 
                    t.priority, 
                    t.due_date, 
                    t.created_at, 
                    t.updated_at, 
                    t.created_by, 
                    t.assigned_to,
                    u1.name as created_by_name,
                    u2.name as assigned_to_name
                FROM ' . $this->table . ' t
                LEFT JOIN users u1 ON t.created_by = u1.id
                LEFT JOIN users u2 ON t.assigned_to = u2.id
                WHERE t.id = :id
                LIMIT 0,1';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Bind ID
        $stmt->bindParam(':id', $this->id);

        // Execute query
        $stmt->execute();

        // Check if task exists
        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // Set properties
            $this->id = $row['id'];
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->status = $row['status'];
            $this->priority = $row['priority'];
            $this->due_date = $row['due_date'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            $this->created_by = $row['created_by'];
            $this->assigned_to = $row['assigned_to'];
            $this->created_by_name = $row['created_by_name'];
            $this->assigned_to_name = $row['assigned_to_name'];

            return true;
        }

        return false;
    }

    /**
     * Create task
     * 
     * @return bool
     */
    public function create() {
        // Create query
        $query = 'INSERT INTO ' . $this->table . ' 
                SET 
                    title = :title, 
                    description = :description, 
                    status = :status, 
                    priority = :priority, 
                    due_date = :due_date, 
                    created_by = :created_by,
                    assigned_to = :assigned_to';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->priority = htmlspecialchars(strip_tags($this->priority));
        
        // Format due date if set
        if($this->due_date) {
            $due_date = date('Y-m-d', strtotime($this->due_date));
        } else {
            $due_date = null;
        }

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':priority', $this->priority);
        $stmt->bindParam(':due_date', $due_date);
        $stmt->bindParam(':created_by', $this->created_by);
        $stmt->bindParam(':assigned_to', $this->assigned_to);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);

        return false;
    }

    /**
     * Update task
     * 
     * @return bool
     */
    public function update() {
        // Create query
        $query = 'UPDATE ' . $this->table . ' 
                SET 
                    title = :title, 
                    description = :description, 
                    status = :status, 
                    priority = :priority, 
                    due_date = :due_date,
                    assigned_to = :assigned_to,
                    updated_at = NOW()
                WHERE id = :id';

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->title = htmlspecialchars(strip_tags($this->title));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->priority = htmlspecialchars(strip_tags($this->priority));
        $this->id = htmlspecialchars(strip_tags($this->id));
        
        // Format due date if set
        if($this->due_date) {
            $due_date = date('Y-m-d', strtotime($this->due_date));
        } else {
            $due_date = null;
        }

        // Bind data
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':priority', $this->priority);
        $stmt->bindParam(':due_date', $due_date);
        $stmt->bindParam(':assigned_to', $this->assigned_to);
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
     * Delete task
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

        // Bind ID
        $stmt->bindParam(':id', $this->id);

        // Execute query
        if($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->error);

        return false;
    }
} 