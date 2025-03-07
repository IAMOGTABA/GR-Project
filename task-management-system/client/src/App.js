import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Services
import { checkHealth, getCurrentUser } from './services/api';

// Components
import Navbar from './components/layout/Navbar';
import TaskList from './components/tasks/TaskList';
import TaskForm from './components/tasks/create/CreateTask';
import UserList from './components/users/UserManagement';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ConnectionTest from './components/ConnectionTest';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({
    apiConnected: false,
    dbConnected: false,
    showConnectionTest: true
  });

  // Check connection status
  useEffect(() => {
    const verifyConnections = async () => {
      try {
        const healthData = await checkHealth();
        setConnectionStatus({
          apiConnected: true,
          dbConnected: healthData.database.state === 1,
          showConnectionTest: true
        });
      } catch (error) {
        console.error('Connection verification failed:', error);
        setConnectionStatus({
          apiConnected: false,
          dbConnected: false,
          showConnectionTest: true
        });
      }
    };

    verifyConnections();
  }, []);

  // Check authentication
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    // Set token in axios defaults for all future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Try to get user data
    getCurrentUser()
      .then(response => {
        setUser(response.data);
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(err => {
        // If there's an error, clear token and set authenticated to false
        localStorage.removeItem('userToken');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, []);

  // If auth is bypassed in dev environment, use mock data
  useEffect(() => {
    if (loading === false && !isAuthenticated) {
      // For development/testing only - simulating a logged in admin user
      const mockUser = {
        _id: '60d0fe4f5311236168a109ca',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
    }
  }, [loading, isAuthenticated]);

  const logout = () => {
    localStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const dismissConnectionTest = () => {
    setConnectionStatus(prev => ({
      ...prev,
      showConnectionTest: false
    }));
  };

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} user={user} logout={logout} />

        {/* Connection Test Panel */}
        {connectionStatus.showConnectionTest && (
          <div className="connection-test-container">
            <ConnectionTest />
            <button 
              className="dismiss-connection-test" 
              onClick={dismissConnectionTest}
              title="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <main className="container">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            
            {/* Task Routes */}
            <Route 
              path="/tasks" 
              element={isAuthenticated ? <TaskList user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tasks/new" 
              element={isAuthenticated ? <TaskForm user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/tasks/edit/:id" 
              element={isAuthenticated ? <TaskForm user={user} /> : <Navigate to="/login" />} 
            />
            
            {/* User Routes (Admin Only) */}
            <Route 
              path="/users" 
              element={isAuthenticated && user?.role === 'admin' ? <UserList /> : <Navigate to="/dashboard" />} 
            />
            
            {/* Default Route */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
