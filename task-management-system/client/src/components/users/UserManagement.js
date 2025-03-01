import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiEdit, FiTrash, FiCheck, FiX, FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '123456', // Default password for testing
    role: 'user',
    department: 'development',
    position: '',
    phone: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Load real users data from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching users from server...');
      const response = await fetch('http://localhost:5000/api/users');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Users fetched successfully:', data.data.length);
        setUsers(data.data);
        setFilteredUsers(data.data);
      } else {
        setError('Failed to load users: ' + (data.message || 'Unknown error'));
        console.error('API error:', data);
      }
    } catch (err) {
      setError('Error connecting to the server: ' + err.message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        user => 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '123456', // Default password for testing
      role: 'user',
      department: 'development',
      position: '',
      phone: ''
    });
    setEditMode(false);
    setCurrentId(null);
    setShowAddForm(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!editMode && !formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (!editMode && formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      console.log('Submitting user data:', formData);
      
      if (editMode) {
        // Update existing user
        const response = await fetch(`http://localhost:5000/api/users/${currentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess('User updated successfully!');
          fetchUsers(); // Refresh the user list
        } else {
          setError(data.message || 'Failed to update user');
        }
      } else {
        // Create new user
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess('User added successfully!');
          fetchUsers(); // Refresh the user list
          resetForm();
        } else {
          setError(data.message || 'Failed to add user');
        }
      }
    } catch (err) {
      setError('Error connecting to the server: ' + err.message);
      console.error('Submit error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/users/${id}`);
      const data = await response.json();
      
      if (data.success) {
        const userToEdit = data.data;
        setFormData({
          name: userToEdit.name || '',
          email: userToEdit.email || '',
          password: '', // Clear password for editing
          role: userToEdit.role || 'user',
          department: userToEdit.department || '',
          position: userToEdit.position || '',
          phone: userToEdit.phone || ''
        });
        setCurrentId(userToEdit._id);
        setEditMode(true);
        setShowAddForm(true);
      } else {
        setError(data.message || 'Failed to load user details');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess('User deleted successfully!');
          fetchUsers(); // Refresh the user list
        } else {
          setError(data.message || 'Failed to delete user');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error('API error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      setIsLoading(true);
      // First, get the current user
      const userResponse = await fetch(`http://localhost:5000/api/users/${id}`);
      const userData = await userResponse.json();
      
      if (!userData.success) {
        throw new Error(userData.message || 'Failed to get user');
      }
      
      const user = userData.data;
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      // Then update the status
      const updateResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const updateData = await updateResponse.json();
      
      if (updateData.success) {
        setSuccess(`User status changed to ${newStatus}`);
        fetchUsers(); // Refresh the user list
      } else {
        setError(updateData.message || 'Failed to update user status');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('API error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button 
          className="btn add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add User'} {showAddForm ? <FiX /> : <FiUserPlus />}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showAddForm && (
        <div className="user-form-container">
          <h3>{editMode ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-control"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className="form-control"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password {editMode && '(leave blank to keep current)'}</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  className="form-control"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={editMode ? "Leave blank to keep current" : "Enter password"}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select 
                  id="role" 
                  name="role" 
                  className="form-control"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select 
                  id="department" 
                  name="department" 
                  className="form-control"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                  <option value="support">Support</option>
                  <option value="management">Management</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input 
                  type="text" 
                  id="position" 
                  name="position" 
                  className="form-control"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Enter position"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input 
                  type="text" 
                  id="phone" 
                  name="phone" 
                  className="form-control"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn submit-btn" disabled={isLoading}>
                {isLoading ? 'Processing...' : editMode ? 'Update User' : 'Add User'}
              </button>
              <button type="button" className="btn cancel-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="user-list-container">
        <div className="user-list-header">
          <h3>Users List</h3>
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="no-users-message">No users found</div>
        ) : (
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>{user.department}</td>
                    <td>{user.position}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn action-btn edit-btn" 
                          onClick={() => handleEditUser(user._id)}
                          title="Edit User"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="btn action-btn delete-btn" 
                          onClick={() => handleDeleteUser(user._id)}
                          title="Delete User"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement; 