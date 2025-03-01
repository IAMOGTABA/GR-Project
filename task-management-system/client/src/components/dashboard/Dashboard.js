import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import './Dashboard.css';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      const role = localStorage.getItem('userRole');

      console.log('Dashboard - checking auth:', { token, role });

      if (token) {
        setIsAuthenticated(true);
        setUserRole(role || 'employee'); // Default to employee if role is not set
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Dashboard - not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  console.log('Dashboard - rendering dashboard for role:', userRole);
  return (
    <>
      {userRole === 'admin' ? <AdminDashboard /> : <UserDashboard />}
    </>
  );
};

export default Dashboard; 