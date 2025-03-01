import React, { useState, useEffect } from 'react';
import { FiSend, FiTrash, FiEdit, FiInfo } from 'react-icons/fi';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    priority: 'normal',
    audience: 'all'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Simulate loading notifications from API
    setIsLoading(true);
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          title: 'System Maintenance',
          message: 'The system will be down for maintenance this weekend. Please complete any pending tasks.',
          priority: 'high',
          audience: 'all',
          sentBy: 'Admin',
          sentAt: '2025-03-01T09:00:00',
          read: []
        },
        {
          id: 2,
          title: 'New Feature Alert',
          message: 'We have added a new task categorization feature. Check it out!',
          priority: 'normal',
          audience: 'all',
          sentBy: 'Admin',
          sentAt: '2025-02-28T14:30:00',
          read: []
        }
      ];
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setNewNotification({
      title: '',
      message: '',
      priority: 'normal',
      audience: 'all'
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      setError('Title and message are required');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editMode && currentId) {
        // Update existing notification
        const updatedNotifications = notifications.map(notification => {
          if (notification.id === currentId) {
            return {
              ...notification,
              ...newNotification,
              updatedAt: new Date().toISOString()
            };
          }
          return notification;
        });
        setNotifications(updatedNotifications);
        setSuccess('Notification updated successfully');
      } else {
        // Create new notification
        const newId = Math.max(0, ...notifications.map(n => n.id)) + 1;
        const notificationToAdd = {
          id: newId,
          ...newNotification,
          sentBy: 'Admin',
          sentAt: new Date().toISOString(),
          read: []
        };
        setNotifications([notificationToAdd, ...notifications]);
        setSuccess('Notification sent successfully');
      }
      resetForm();
      setIsLoading(false);
    }, 800);
  };

  const handleEdit = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      setNewNotification({
        title: notification.title,
        message: notification.message,
        priority: notification.priority,
        audience: notification.audience
      });
      setEditMode(true);
      setCurrentId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filteredNotifications = notifications.filter(n => n.id !== id);
        setNotifications(filteredNotifications);
        setSuccess('Notification deleted successfully');
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-grid">
        <div className="notifications-form-container">
          <h2>{editMode ? 'Edit Notification' : 'Send Notification'}</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          
          <form onSubmit={handleSubmit} className="notifications-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                id="title"
                name="title"
                className="form-control"
                value={newNotification.title}
                onChange={handleChange}
                placeholder="Notification title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message"
                name="message"
                className="form-control"
                value={newNotification.message}
                onChange={handleChange}
                rows="5"
                placeholder="Notification message"
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select 
                  id="priority"
                  name="priority"
                  className="form-control"
                  value={newNotification.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="audience">Audience</label>
                <select 
                  id="audience"
                  name="audience"
                  className="form-control"
                  value={newNotification.audience}
                  onChange={handleChange}
                >
                  <option value="all">All Users</option>
                  <option value="employees">Employees Only</option>
                  <option value="admins">Admins Only</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (editMode ? 'Update Notification' : 'Send Notification')}
                <FiSend className="icon-right" />
              </button>
              {editMode && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="notifications-list-container">
          <h2>Recent Notifications</h2>
          
          {isLoading && notifications.length === 0 ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="no-notifications">
              <FiInfo size={30} />
              <p>No notifications have been sent yet.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div key={notification.id} className={`notification-card priority-${notification.priority}`}>
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <div className="notification-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEdit(notification.id)}
                        title="Edit notification"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(notification.id)}
                        title="Delete notification"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                  
                  <p className="notification-message">{notification.message}</p>
                  
                  <div className="notification-meta">
                    <div className="notification-audience">
                      Audience: <span>{notification.audience === 'all' ? 'All Users' : 
                      notification.audience === 'employees' ? 'Employees Only' : 'Admins Only'}</span>
                    </div>
                    <div className="notification-date">
                      Sent: <span>{new Date(notification.sentAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 