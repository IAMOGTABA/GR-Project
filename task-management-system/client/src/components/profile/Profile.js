import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiEdit2 } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  // Get user data from localStorage (in a real app, would come from API)
  const userRole = localStorage.getItem('userRole') || 'employee';
  const userName = localStorage.getItem('userName') || 'User';

  // Mock user data
  const [userData, setUserData] = useState({
    name: userName,
    email: userRole === 'admin' ? 'admin@example.com' : 'employee@example.com',
    phone: '+1 (555) 123-4567',
    role: userRole,
    department: userRole === 'admin' ? 'Administration' : 'Engineering',
    joinDate: '2023-01-15',
    tasksCompleted: userRole === 'admin' ? 45 : 23,
    tasksAssigned: userRole === 'admin' ? 120 : 35,
    avatar: userName.charAt(0).toUpperCase()
  });

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordFormData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordFormData.newPassword) newErrors.newPassword = 'New password is required';
    else if (passwordFormData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: userData.phone
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would be an API call
      setUserData({
        ...userData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      // Update localStorage for name to reflect in the UI
      localStorage.setItem('userName', formData.name);
      
      setIsEditing(false);
      // Success message would be shown here
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      // In a real app, this would be an API call to change password
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setShowPasswordForm(false);
      // Success message would be shown here
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-large">
          {userData.avatar}
        </div>
        <div className="profile-title">
          <h1>{userData.name}</h1>
          <p>{userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} - {userData.department}</p>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-value">{userData.tasksCompleted}</span>
            <span className="stat-label">Tasks Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userData.tasksAssigned}</span>
            <span className="stat-label">Tasks Assigned</span>
          </div>
        </div>
      </div>

      <div className="profile-body">
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            <button 
              onClick={handleEditToggle} 
              className={`btn-icon ${isEditing ? 'btn-danger' : ''}`}
            >
              {isEditing ? 'Cancel' : <><FiEdit2 /> Edit</>}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <FiUser className="input-icon" /> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  <FiMail className="input-icon" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">
                  <FiPhone className="input-icon" /> Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={userData.department}
                  disabled
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Join Date</label>
                <input
                  type="text"
                  value={userData.joinDate}
                  disabled
                />
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <FiSave /> Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="profile-card">
          <div className="card-header">
            <h2>Security</h2>
            <button 
              onClick={() => setShowPasswordForm(!showPasswordForm)} 
              className="btn-icon"
            >
              {showPasswordForm ? 'Cancel' : <><FiLock /> Change Password</>}
            </button>
          </div>

          {showPasswordForm ? (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordFormData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className={errors.currentPassword ? 'error' : ''}
                  />
                  {errors.currentPassword && <div className="error-message">{errors.currentPassword}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordFormData.newPassword}
                    onChange={handlePasswordInputChange}
                    className={errors.newPassword ? 'error' : ''}
                  />
                  {errors.newPassword && <div className="error-message">{errors.newPassword}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordFormData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Update Password
                </button>
              </div>
            </form>
          ) : (
            <div className="password-info">
              <p>Your password was last changed on: <strong>2023-04-15</strong></p>
              <p>For security reasons, it's recommended to change your password regularly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 