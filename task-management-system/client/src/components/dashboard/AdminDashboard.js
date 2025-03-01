import React from 'react';
import { FiUsers, FiCheckCircle, FiAlertCircle, FiClock, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Simulated data for admin dashboard
  const stats = {
    users: {
      total: 10,
      active: 8,
      inactive: 2,
      admins: 1,
      employees: 9
    },
    tasks: {
      total: 15,
      completed: 5,
      inProgress: 4,
      pending: 4, 
      overdue: 2
    },
    messages: {
      total: 5,
      unread: 2,
      sent: 3
    },
    announcements: {
      total: 2,
      active: 1
    }
  };

  // Calculate task percentages
  const taskCompletedPercentage = (stats.tasks.completed / stats.tasks.total) * 100 || 0;
  const taskPendingPercentage = (stats.tasks.pending / stats.tasks.total) * 100 || 0;
  const taskInProgressPercentage = (stats.tasks.inProgress / stats.tasks.total) * 100 || 0;
  const taskOverduePercentage = (stats.tasks.overdue / stats.tasks.total) * 100 || 0;

  // Simulated recent activities
  const recentActivities = [
    { id: 1, action: 'User created', user: 'John Doe', date: '2023-05-01', time: '10:30 AM' },
    { id: 2, action: 'Task assigned', user: 'Jane Smith', taskId: 'TASK-123', date: '2023-05-01', time: '11:45 AM' },
    { id: 3, action: 'Task completed', user: 'Mike Johnson', taskId: 'TASK-120', date: '2023-05-01', time: '02:15 PM' },
  ];

  return (
    <div className="dashboard admin-dashboard">
      <div className="dashboard-header">
        <h1>Administration Dashboard</h1>
        <p>Welcome back, {localStorage.getItem('userName') || 'Admin'}!</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FiUsers size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Users</h3>
            <div className="stat-value">{stats.users.total}</div>
            <div className="stat-breakdown">
              <span>{stats.users.active} active</span>
              <span>{stats.users.inactive} inactive</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiCheckCircle size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Tasks</h3>
            <div className="stat-value">{stats.tasks.total}</div>
            <div className="stat-breakdown">
              <span>{stats.tasks.completed} completed</span>
              <span>{stats.tasks.pending} pending</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiMessageSquare size={24} />
          </div>
          <div className="stat-details">
            <h3>Messages</h3>
            <div className="stat-value">{stats.messages.total}</div>
            <div className="stat-breakdown">
              <span>{stats.messages.unread} unread</span>
              <span>{stats.messages.sent} sent</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FiAlertCircle size={24} />
          </div>
          <div className="stat-details">
            <h3>Announcements</h3>
            <div className="stat-value">{stats.announcements.total}</div>
            <div className="stat-breakdown">
              <span>{stats.announcements.active} active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>User Distribution</h2>
          <div className="user-distribution">
            <div className="distribution-item">
              <h3>Administrators</h3>
              <div className="distribution-bar-container">
                <div className="distribution-bar admin-bar" style={{ width: `${(stats.users.admins / stats.users.total) * 100}%` }}></div>
              </div>
              <div className="distribution-value">{stats.users.admins}</div>
            </div>
            <div className="distribution-item">
              <h3>Employees</h3>
              <div className="distribution-bar-container">
                <div className="distribution-bar employee-bar" style={{ width: `${(stats.users.employees / stats.users.total) * 100}%` }}></div>
              </div>
              <div className="distribution-value">{stats.users.employees}</div>
            </div>
          </div>
          <div className="card-action">
            <Link to="/admin/users" className="btn btn-sm">Manage Users</Link>
          </div>
        </div>

        <div className="card">
          <h2>Task Overview</h2>
          <div className="task-overview">
            <div className="progress-item">
              <div className="progress-label">
                <span>Completed</span>
                <span>{taskCompletedPercentage.toFixed(0)}%</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${taskCompletedPercentage}%`,
                    backgroundColor: 'var(--completed-color)' 
                  }}
                ></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>In Progress</span>
                <span>{taskInProgressPercentage.toFixed(0)}%</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${taskInProgressPercentage}%`,
                    backgroundColor: 'var(--progress-color)' 
                  }}
                ></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Pending</span>
                <span>{taskPendingPercentage.toFixed(0)}%</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${taskPendingPercentage}%`,
                    backgroundColor: 'var(--pending-color)' 
                  }}
                ></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">
                <span>Overdue</span>
                <span>{taskOverduePercentage.toFixed(0)}%</span>
              </div>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${taskOverduePercentage}%`,
                    backgroundColor: 'var(--danger-color)' 
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="card-action">
            <Link to="/admin/tasks" className="btn btn-sm">View All Tasks</Link>
          </div>
        </div>

        <div className="card">
          <h2>
            <FiClock className="card-icon" /> Recent Activity
          </h2>
          <div className="recent-activity">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-details">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-user">by {activity.user}</div>
                  {activity.taskId && (
                    <div className="activity-task-id">{activity.taskId}</div>
                  )}
                </div>
                <div className="activity-time">
                  <div>{activity.date}</div>
                  <div>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card-action">
            <Link to="/admin/activity" className="btn btn-sm">View All Activity</Link>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/admin/users/create" className="btn">Create User</Link>
          <Link to="/admin/tasks/create" className="btn">Create Task</Link>
          <Link to="/admin/announcements/create" className="btn">Post Announcement</Link>
          <Link to="/admin/messages/compose" className="btn">Send Message</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 