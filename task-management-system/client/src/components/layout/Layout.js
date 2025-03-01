import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiList, FiUser, FiMessageSquare, 
         FiBell, FiUsers, FiPlusCircle, FiLogOut } from 'react-icons/fi';

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') || 'employee';
  const userName = localStorage.getItem('userName') || 'User';

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Menu items based on user role
  const getMenuItems = () => {
    if (userRole === 'admin') {
      return [
        { path: '/dashboard', text: 'Dashboard', icon: <FiHome /> },
        { path: '/profile', text: 'Profile', icon: <FiUser /> },
        { path: '/messages', text: 'Messages', icon: <FiMessageSquare /> },
        { path: '/notifications', text: 'Send Notifications', icon: <FiBell /> },
        { path: '/users', text: 'Manage Users', icon: <FiUsers /> },
        { path: '/task/create', text: 'Create Task', icon: <FiPlusCircle /> },
        { path: '/tasks', text: 'All Tasks', icon: <FiList /> },
      ];
    } else {
      return [
        { path: '/dashboard', text: 'Dashboard', icon: <FiHome /> },
        { path: '/tasks', text: 'My Tasks', icon: <FiList /> },
        { path: '/profile', text: 'Profile', icon: <FiUser /> },
        { path: '/messages', text: 'Messages', icon: <FiMessageSquare /> },
      ];
    }
  };

  const menuItems = getMenuItems();
  const userRoleDisplay = userRole === 'admin' ? 'Administrator' : 'Employee';
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  // Get current page title based on pathname
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/profile') return 'Profile';
    if (path === '/messages') return 'Messages';
    if (path === '/tasks') return 'Tasks';
    if (path === '/users') return 'Manage Users';
    if (path === '/task/create') return 'Create Task';
    if (path === '/notifications') return 'Notifications';
    return 'Task Management';
  };

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <FiMenu /> : <FiX />}
          </button>
          {!sidebarCollapsed && <h2>Task Manager</h2>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.text}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="logout-link">
            <span className="icon"><FiLogOut /></span>
            <span className="text">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Top Navigation */}
        <div className="navbar">
          <div className="navbar-brand">
            {getPageTitle()}
          </div>
          <div className="navbar-user">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{userName}</div>
              <div className="user-role">{userRoleDisplay}</div>
            </div>
          </div>
        </div>

        {/* Page Content - Outlet instead of children */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 