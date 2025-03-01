import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiFileText, FiClock, FiTag, FiSave } from 'react-icons/fi';
import './CreateTask.css';

const CreateTask = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    attachments: null
  });

  // Fetch users for assignment dropdown
  useEffect(() => {
    // Simulate API call to get users
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'Admin User', username: 'admin', role: 'admin' },
        { id: 2, name: 'John Doe', username: 'johndoe', role: 'employee' },
        { id: 3, name: 'Jane Smith', username: 'janesmith', role: 'employee' },
        { id: 4, name: 'Mike Johnson', username: 'mikej', role: 'employee' }
      ];
      setUsers(mockUsers);
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: e.target.files
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Task title is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Task description is required');
      return false;
    }
    
    if (!formData.dueDate) {
      setError('Due date is required');
      return false;
    }
    
    if (!formData.assignedTo) {
      setError('Please assign this task to a user');
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call to create task
    setTimeout(() => {
      // Create a new task object
      const newTask = {
        id: Math.floor(Math.random() * 1000) + 1,
        ...formData,
        status: 'pending',
        createdBy: 'Admin',
        createdAt: new Date().toLocaleString(),
        attachments: formData.attachments ? Array.from(formData.attachments).map(file => file.name) : []
      };
      
      console.log('New task created:', newTask);
      
      setSuccess('Task created successfully!');
      setIsLoading(false);
      
      // Reset form or redirect
      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    }, 1000);
  };

  const formatToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const assignedUser = formData.assignedTo ? users.find(u => u.id.toString() === formData.assignedTo) : null;

  return (
    <div className="create-task-container">
      <div className="create-task-header">
        <h1>Create New Task</h1>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      
      <div className="create-task-form-container">
        <form onSubmit={handleSubmit} className="create-task-form">
          <div className="form-group">
            <label htmlFor="title">
              <FiFileText className="form-icon" />
              Task Title
            </label>
            <input 
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">
              <FiFileText className="form-icon" />
              Task Description
            </label>
            <textarea 
              id="description"
              name="description"
              className="form-control"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">
                <FiTag className="form-icon" />
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dueDate">
                <FiCalendar className="form-icon" />
                Due Date
              </label>
              <input 
                type="date"
                id="dueDate"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                min={formatToday()}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="assignedTo">
              <FiUser className="form-icon" />
              Assign To
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              className="form-control"
              value={formData.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select a user</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.username})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="attachments">
              <FiFileText className="form-icon" />
              Attachments (Optional)
            </label>
            <input 
              type="file"
              id="attachments"
              name="attachments"
              className="form-control file-input"
              onChange={handleFileChange}
              multiple
            />
            <small className="form-text text-muted">
              You can attach multiple files to this task (max size: 5MB each)
            </small>
          </div>
          
          {formData.assignedTo && (
            <div className="assignment-preview">
              <div className="preview-header">Task Assignment Preview</div>
              <div className="preview-content">
                <div className="preview-field">
                  <span className="preview-label">Task:</span>
                  <span className="preview-value">{formData.title || 'Untitled Task'}</span>
                </div>
                <div className="preview-field">
                  <span className="preview-label">Assigned to:</span>
                  <span className="preview-value">
                    {assignedUser ? assignedUser.name : 'Unknown'}
                  </span>
                </div>
                <div className="preview-field">
                  <span className="preview-label">Due by:</span>
                  <span className="preview-value">
                    {formData.dueDate ? new Date(formData.dueDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
                <div className="preview-field">
                  <span className="preview-label">Priority:</span>
                  <span className={`preview-value priority-${formData.priority}`}>
                    {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Task...' : 'Create Task'}
              <FiSave className="btn-icon" />
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/tasks')}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask; 