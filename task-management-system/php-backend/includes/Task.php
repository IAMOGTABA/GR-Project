<?php
require_once __DIR__ . '/../config/database.php';

class Task {
    // DB connection
    private $conn;
    private $table = 'tasks';

    // Task properties
    public $id;
    public $title;
    public $description;
    public $status;
    public $priority;
    public $category;
    public $assigned_to;
    public $assigned_by;
    public $start_date;
    public $due_date;
    public $completed_date;
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
     * Get all tasks
     */
    public function getAll() {
        $query = "SELECT 
                t.id, t.title, t.description, t.status, t.priority, t.category, 
                t.assigned_by, t.start_date, t.due_date, t.completed_date, 
                t.created_at, t.updated_at,
                u.name as assigned_by_name,
                GROUP_CONCAT(DISTINCT ta.user_id) as assigned_to
            FROM 
                {$this->table} t
            LEFT JOIN
                users u ON t.assigned_by = u.id
            LEFT JOIN
                task_assignments ta ON t.id = ta.task_id
            GROUP BY
                t.id
            ORDER BY
                t.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        
        return $stmt;
    }

    /**
     * Get single task
     */
    public function getById() {
        $query = "SELECT 
                t.id, t.title, t.description, t.status, t.priority, t.category, 
                t.assigned_by, t.start_date, t.due_date, t.completed_date, 
                t.created_at, t.updated_at,
                u.name as assigned_by_name,
                GROUP_CONCAT(DISTINCT ta.user_id) as assigned_to
            FROM 
                {$this->table} t
            LEFT JOIN
                users u ON t.assigned_by = u.id
            LEFT JOIN
                task_assignments ta ON t.id = ta.task_id
            WHERE 
                t.id = :id
            GROUP BY
                t.id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch();
        
        if($row) {
            $this->title = $row['title'];
            $this->description = $row['description'];
            $this->status = $row['status'];
            $this->priority = $row['priority'];
            $this->category = $row['category'];
            $this->assigned_by = $row['assigned_by'];
            $this->start_date = $row['start_date'];
            $this->due_date = $row['due_date'];
            $this->completed_date = $row['completed_date'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            $this->assigned_to = $row['assigned_to'] ? explode(',', $row['assigned_to']) : [];
            
            return true;
        }
        
        return false;
    }

    /**
     * Create task
     */
    public function create() {
        // Start transaction
        $this->conn->beginTransaction();
        
        try {
            $query = "INSERT INTO {$this->table}
                (title, description, status, priority, category, assigned_by, start_date, due_date) 
                VALUES
                (:title, :description, :status, :priority, :category, :assigned_by, :start_date, :due_date)";
                
            $stmt = $this->conn->prepare($query);
            
            // Clean and secure data
            $this->title = htmlspecialchars(strip_tags($this->title));
            $this->description = htmlspecialchars(strip_tags($this->description));
            $this->status = htmlspecialchars(strip_tags($this->status));
            $this->priority = htmlspecialchars(strip_tags($this->priority));
            $this->category = htmlspecialchars(strip_tags($this->category));
            $this->assigned_by = htmlspecialchars(strip_tags($this->assigned_by));
            
            // Bind parameters
            $stmt->bindParam(':title', $this->title);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':priority', $this->priority);
            $stmt->bindParam(':category', $this->category);
            $stmt->bindParam(':assigned_by', $this->assigned_by);
            $stmt->bindParam(':start_date', $this->start_date);
            $stmt->bindParam(':due_date', $this->due_date);
            
            $stmt->execute();
            
            $this->id = $this->conn->lastInsertId();
            
            // Insert task assignments
            if (is_array($this->assigned_to) && !empty($this->assigned_to)) {
                $this->addAssignments($this->assigned_to);
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (PDOException $e) {
            // Rollback transaction if error
            $this->conn->rollBack();
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    /**
     * Update task
     */
    public function update() {
        // Start transaction
        $this->conn->beginTransaction();
        
        try {
            $query = "UPDATE {$this->table}
                SET
                    title = :title,
                    description = :description,
                    status = :status,
                    priority = :priority,
                    category = :category,
                    due_date = :due_date,
                    completed_date = :completed_date
                WHERE
                    id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            // Clean and secure data
            $this->id = htmlspecialchars(strip_tags($this->id));
            $this->title = htmlspecialchars(strip_tags($this->title));
            $this->description = htmlspecialchars(strip_tags($this->description));
            $this->status = htmlspecialchars(strip_tags($this->status));
            $this->priority = htmlspecialchars(strip_tags($this->priority));
            $this->category = htmlspecialchars(strip_tags($this->category));
            
            // Bind parameters
            $stmt->bindParam(':id', $this->id);
            $stmt->bindParam(':title', $this->title);
            $stmt->bindParam(':description', $this->description);
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':priority', $this->priority);
            $stmt->bindParam(':category', $this->category);
            $stmt->bindParam(':due_date', $this->due_date);
            $stmt->bindParam(':completed_date', $this->completed_date);
            
            $stmt->execute();
            
            // Update task assignments
            if (is_array($this->assigned_to)) {
                // Delete existing assignments
                $this->deleteAssignments();
                
                // Add new assignments
                if (!empty($this->assigned_to)) {
                    $this->addAssignments($this->assigned_to);
                }
            }
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (PDOException $e) {
            // Rollback transaction if error
            $this->conn->rollBack();
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    /**
     * Delete task
     */
    public function delete() {
        // Start transaction
        $this->conn->beginTransaction();
        
        try {
            // Delete task assignments
            $this->deleteAssignments();
            
            // Delete task comments
            $this->deleteComments();
            
            // Delete task attachments
            $this->deleteAttachments();
            
            // Delete task
            $query = "DELETE FROM {$this->table} WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            $this->id = htmlspecialchars(strip_tags($this->id));
            
            $stmt->bindParam(':id', $this->id);
            
            $stmt->execute();
            
            // Commit transaction
            $this->conn->commit();
            
            return true;
        } catch (PDOException $e) {
            // Rollback transaction if error
            $this->conn->rollBack();
            echo "Error: " . $e->getMessage();
            return false;
        }
    }

    /**
     * Get tasks by user
     */
    public function getByUser($user_id) {
        $query = "SELECT 
                t.id, t.title, t.description, t.status, t.priority, t.category, 
                t.assigned_by, t.start_date, t.due_date, t.completed_date, 
                t.created_at, t.updated_at,
                u.name as assigned_by_name,
                GROUP_CONCAT(DISTINCT ta.user_id) as assigned_to
            FROM 
                {$this->table} t
            LEFT JOIN
                users u ON t.assigned_by = u.id
            JOIN
                task_assignments ta ON t.id = ta.task_id
            WHERE 
                ta.user_id = :user_id OR t.assigned_by = :user_id
            GROUP BY
                t.id
            ORDER BY
                t.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        return $stmt;
    }
    
    /**
     * Get tasks by status
     */
    public function getByStatus($status) {
        $query = "SELECT 
                t.id, t.title, t.description, t.status, t.priority, t.category, 
                t.assigned_by, t.start_date, t.due_date, t.completed_date, 
                t.created_at, t.updated_at,
                u.name as assigned_by_name,
                GROUP_CONCAT(DISTINCT ta.user_id) as assigned_to
            FROM 
                {$this->table} t
            LEFT JOIN
                users u ON t.assigned_by = u.id
            LEFT JOIN
                task_assignments ta ON t.id = ta.task_id
            WHERE 
                t.status = :status
            GROUP BY
                t.id
            ORDER BY
                t.created_at DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        
        return $stmt;
    }
    
    /**
     * Search tasks
     */
    public function search($term) {
        $query = "SELECT 
                t.id, t.title, t.description, t.status, t.priority, t.category, 
                t.assigned_by, t.start_date, t.due_date, t.completed_date, 
                t.created_at, t.updated_at,
                u.name as assigned_by_name,
                GROUP_CONCAT(DISTINCT ta.user_id) as assigned_to
            FROM 
                {$this->table} t
            LEFT JOIN
                users u ON t.assigned_by = u.id
            LEFT JOIN
                task_assignments ta ON t.id = ta.task_id
            WHERE 
                t.title LIKE :term OR t.description LIKE :term
            GROUP BY
                t.id
            ORDER BY
                t.created_at DESC";
        
        $term = "%{$term}%";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':term', $term);
        $stmt->execute();
        
        return $stmt;
    }

    /**
     * Add task assignments
     */
    private function addAssignments($user_ids) {
        $query = "INSERT INTO task_assignments (task_id, user_id) VALUES (:task_id, :user_id)";
        $stmt = $this->conn->prepare($query);
        
        foreach($user_ids as $user_id) {
            $stmt->bindParam(':task_id', $this->id);
            $stmt->bindParam(':user_id', $user_id);
            $stmt->execute();
        }
    }

    /**
     * Delete task assignments
     */
    private function deleteAssignments() {
        $query = "DELETE FROM task_assignments WHERE task_id = :task_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':task_id', $this->id);
        $stmt->execute();
    }

    /**
     * Delete task comments
     */
    private function deleteComments() {
        $query = "DELETE FROM task_comments WHERE task_id = :task_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':task_id', $this->id);
        $stmt->execute();
    }

    /**
     * Delete task attachments
     */
    private function deleteAttachments() {
        // First get all attachments
        $query = "SELECT path FROM task_attachments WHERE task_id = :task_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':task_id', $this->id);
        $stmt->execute();
        
        // Delete physical files
        while($row = $stmt->fetch()) {
            $file_path = UPLOAD_PATH . $row['path'];
            if(file_exists($file_path)) {
                unlink($file_path);
            }
        }
        
        // Delete records from database
        $query = "DELETE FROM task_attachments WHERE task_id = :task_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':task_id', $this->id);
        $stmt->execute();
    }
} 