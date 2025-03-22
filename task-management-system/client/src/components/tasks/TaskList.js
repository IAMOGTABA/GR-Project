import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiEye, FiEdit, FiXCircle } from 'react-icons/fi';
import { taskService } from '../../services/api';
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch tasks from the API
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await taskService.getAllTasks();
        
        if (response.success) {
          console.log('Tasks fetched successfully:', response.data);
          setTasks(response.data || []);
          setError('');
        } else {
          console.error('Failed to fetch tasks:', response.message);
          setError(response.message || 'Failed to load tasks');
          // Load mock data as fallback
          loadMockData();
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Error connecting to the server. Showing demo data.');
        // Load mock data as fallback
        loadMockData();
      } finally {
        setIsLoading(false);
      }
    };

    // Fallback to mock data if API fails
    const loadMockData = () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Complete project documentation',
          description: 'Write detailed documentation for the new task management system',
          status: 'pending',
          priority: 'high',
          dueDate: '2023-06-15',
          assignedTo: 'John Doe',
          createdBy: 'Admin User',
          createdAt: '2023-06-01'
        },
        {
          id: 2,
          title: 'Fix login page bug',
          description: 'There is an issue with the login form validation',
          status: 'in-progress',
          priority: 'medium',
          dueDate: '2023-06-10',
          assignedTo: 'John Doe',
          createdBy: 'Admin User',
          createdAt: '2023-06-02'
        },
        {
          id: 3,
          title: 'Design new dashboard',
          description: 'Create wireframes for the new admin dashboard',
          status: 'overdue',
          priority: 'high',
          dueDate: '2023-06-05',
          assignedTo: 'Jane Smith',
          createdBy: 'Admin User',
          createdAt: '2023-06-01'
        },
        {
          id: 4,
          title: 'Update user profile page',
          description: 'Add new fields to the user profile form',
          status: 'completed',
          priority: 'low',
          dueDate: '2023-06-08',
          assignedTo: 'John Doe',
          createdBy: 'Admin User',
          completedAt: '2023-06-07',
          createdAt: '2023-06-03'
        }
      ];
      
      setTasks(mockTasks);
      console.log('Loaded mock task data as fallback');
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') || 'employee';

  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <FiCheckCircle className="status-icon completed" />;
      case 'in-progress': return <FiClock className="status-icon in-progress" />;
      case 'overdue': return <FiAlertTriangle className="status-icon overdue" />;
      default: return <FiClock className="status-icon pending" />;
    }
  };

  // Handle mark as complete
  const handleMarkComplete = async (id) => {
    try {
      const response = await taskService.updateTask(id, { status: 'completed' });
      
      if (response.success) {
        // Update local state
        const updatedTasks = tasks.map(task => 
          task.id === id 
          ? { ...task, status: 'completed', completedAt: new Date().toISOString() } 
          : task
        );
        setTasks(updatedTasks);
        
        // Show success message
        alert(`Task #${id} marked as complete!`);
      } else {
        // Show error message
        alert(`Failed to update task: ${response.message}`);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      
      // Fallback to client-side update if API fails
      const updatedTasks = tasks.map(task => 
        task.id === id 
        ? { ...task, status: 'completed', completedAt: new Date().toISOString() } 
        : task
      );
      setTasks(updatedTasks);
      
      alert(`Task #${id} marked as complete (offline mode)`);
    }
  };

  // Handle view task details
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  // Handle change task status
  const handleChangeStatus = async (id, newStatus) => {
    try {
      const response = await taskService.updateTask(id, { status: newStatus });
      
      if (response.success) {
        // Update local state
        const updatedTasks = tasks.map(task => 
          task.id === id 
          ? { ...task, status: newStatus } 
          : task
        );
        setTasks(updatedTasks);
        
        // Show success message
        alert(`Task status updated to: ${newStatus}`);
      } else {
        // Show error message
        alert(`Failed to update task status: ${response.message}`);
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      
      // Fallback to client-side update if API fails
      const updatedTasks = tasks.map(task => 
        task.id === id 
        ? { ...task, status: newStatus } 
        : task
      );
      setTasks(updatedTasks);
      
      alert(`Task status updated to: ${newStatus} (offline mode)`);
    }
  };

  // Close task detail modal
  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="task-list-header">
        <h1>{userRole === 'admin' ? 'All Tasks' : 'My Tasks'}</h1>
        <div className="task-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found matching your filter.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <div className="task-card-header">
                <div className={`priority-indicator ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </div>
                <div className="task-status-dropdown">
                  {getStatusIcon(task.status)}
                  <select 
                    value={task.status}
                    onChange={(e) => handleChangeStatus(task.id, e.target.value)}
                    className={`status-select ${task.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <div className="task-due-date">
                  <span className="label">Due:</span>
                  <span className="value">{task.dueDate}</span>
                </div>
                <div className="task-assigned">
                  <span className="label">Assigned to:</span>
                  <span className="value">{task.assignedTo}</span>
                </div>
              </div>
              <div className="task-actions">
                {task.status !== 'completed' && (
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleMarkComplete(task.id)}
                  >
                    <FiCheckCircle /> Mark Complete
                  </button>
                )}
                <button 
                  className="btn btn-sm btn-outline"
                  onClick={() => handleViewDetails(task)}
                >
                  <FiEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="task-detail-overlay">
          <div className="task-detail-modal">
            <div className="task-detail-header">
              <h2>Task Details</h2>
              <button className="close-btn" onClick={handleCloseTaskDetail}>
                <FiXCircle />
              </button>
            </div>
            <div className="task-detail-content">
              <div className="task-detail-field">
                <span className="field-label">Title:</span>
                <span className="field-value">{selectedTask.title}</span>
              </div>
              <div className="task-detail-field">
                <span className="field-label">Description:</span>
                <p className="field-value">{selectedTask.description}</p>
              </div>
              <div className="task-detail-row">
                <div className="task-detail-field">
                  <span className="field-label">Status:</span>
                  <span className={`status-badge ${selectedTask.status}`}>
                    {selectedTask.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="task-detail-field">
                  <span className="field-label">Priority:</span>
                  <span className={`priority-badge ${getPriorityClass(selectedTask.priority)}`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>
              <div className="task-detail-row">
                <div className="task-detail-field">
                  <span className="field-label">Due Date:</span>
                  <span className="field-value">{selectedTask.dueDate}</span>
                </div>
                <div className="task-detail-field">
                  <span className="field-label">Assigned To:</span>
                  <span className="field-value">{selectedTask.assignedTo}</span>
                </div>
              </div>
              <div className="task-detail-row">
                <div className="task-detail-field">
                  <span className="field-label">Created By:</span>
                  <span className="field-value">{selectedTask.createdBy}</span>
                </div>
                <div className="task-detail-field">
                  <span className="field-label">Created Date:</span>
                  <span className="field-value">{selectedTask.createdAt}</span>
                </div>
              </div>
              {selectedTask.completedAt && (
                <div className="task-detail-field">
                  <span className="field-label">Completed Date:</span>
                  <span className="field-value">{selectedTask.completedAt}</span>
                </div>
              )}
            </div>
            <div className="task-detail-actions">
              {selectedTask.status !== 'completed' && (
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    handleMarkComplete(selectedTask.id);
                    handleCloseTaskDetail();
                  }}
                >
                  <FiCheckCircle /> Mark Complete
                </button>
              )}
              {userRole === 'admin' && (
                <button className="btn btn-primary">
                  <FiEdit /> Edit Task
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleCloseTaskDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList; 