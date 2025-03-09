import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Components
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import TaskUpload from './components/tasks/TaskUpload';
import Profile from './components/profile/Profile';
import Messages from './components/messages/Messages';
import Notifications from './components/notifications/Notifications';
import UserManagement from './components/users/UserManagement';
import CreateTask from './components/tasks/create/CreateTask';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    console.log('App initialization - token:', token);
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('userToken');
    if (isLoading) return <div className="loading-spinner"></div>;
    if (!token) return <Navigate to="/login" />;
    return children;
  };

  // Admin route component
  const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    if (isLoading) return <div className="loading-spinner"></div>;
    if (!token) return <Navigate to="/login" />;
    if (userRole !== 'admin') return <Navigate to="/dashboard" />;
    return children;
  };

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          localStorage.getItem('userToken') ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />
        } />

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="messages" element={<Messages />} />
          <Route path="upload" element={<TaskUpload />} />
          
          {/* Admin only routes */}
          <Route path="notifications" element={
            <AdminRoute>
              <Notifications />
            </AdminRoute>
          } />
          <Route path="users" element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          } />
          <Route path="task/create" element={
            <AdminRoute>
              <CreateTask />
            </AdminRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
