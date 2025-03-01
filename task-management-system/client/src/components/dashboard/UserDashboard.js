import React from 'react';
import { FiCalendar, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const UserDashboard = () => {
  // Simulated task data
  const taskStats = {
    total: 2,
    completed: 0,
    pending: 2,
    inProgress: 0,
    overdue: 2,
    noDeadline: 0,
  };

  // Calculate percentages
  const completedPercentage = (taskStats.completed / taskStats.total) * 100 || 0;
  const pendingPercentage = (taskStats.pending / taskStats.total) * 100 || 0;
  const inProgressPercentage = (taskStats.inProgress / taskStats.total) * 100 || 0;
  const overduePercentage = (taskStats.overdue / taskStats.total) * 100 || 0;

  // Mock notifications and messages
  const notifications = [];
  const messages = [
    {
      id: 1,
      sender: 'Admin',
      subject: 'Welcome to the Task Management System',
      content: 'Welcome to our new task management system! Please let me know if you have any questions.',
      date: new Date().toLocaleDateString(),
    },
  ];

  // Mock upcoming tasks
  const upcomingTasks = [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {localStorage.getItem('userName') || 'User'}!</p>
      </div>

      <div className="card">
        <h2>My Task Statistics</h2>
        <p>An overview of your tasks and progress.</p>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <div className="stat-value">
              {taskStats.completed} / {taskStats.total}
            </div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${completedPercentage}%`,
                  backgroundColor: 'var(--completed-color)',
                }}
              ></div>
            </div>
            <div className="stat-percentage">{completedPercentage.toFixed(0)}%</div>
          </div>

          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <div className="stat-value">{taskStats.pending}</div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${pendingPercentage}%`,
                  backgroundColor: 'var(--pending-color)',
                }}
              ></div>
            </div>
            <div className="stat-percentage">{pendingPercentage.toFixed(0)}%</div>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <div className="stat-value">{taskStats.inProgress}</div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${inProgressPercentage}%`,
                  backgroundColor: 'var(--progress-color)',
                }}
              ></div>
            </div>
            <div className="stat-percentage">{inProgressPercentage.toFixed(0)}%</div>
          </div>

          <div className="stat-card">
            <h3>Overdue</h3>
            <div className="stat-value">{taskStats.overdue}</div>
            <div className="progress-container">
              <div
                className="progress-bar"
                style={{
                  width: `${overduePercentage}%`,
                  backgroundColor: 'var(--danger-color)',
                }}
              ></div>
            </div>
            <div className="stat-percentage">{overduePercentage.toFixed(0)}%</div>
          </div>

          <div className="stat-card">
            <h3>No Deadline</h3>
            <div className="stat-value">{taskStats.noDeadline}</div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>
            <FiCalendar className="card-icon" /> Tasks Due Soon (within 3 days)
          </h2>
          {upcomingTasks.length > 0 ? (
            <div className="task-list">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-title">
                    <h3>{task.title}</h3>
                    <p>Due: {task.dueDate}</p>
                  </div>
                  <span
                    className={`task-status status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No tasks due within the next 3 days.</p>
          )}
        </div>

        <div className="card">
          <h2>
            <FiAlertCircle className="card-icon" /> Announcements
          </h2>
          {notifications.length > 0 ? (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-item">
                  <div className="notification-content">
                    <h3>{notification.title}</h3>
                    <p>{notification.message}</p>
                  </div>
                  <div className="notification-date">{notification.date}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">You have no announcements at this time.</p>
          )}
        </div>

        <div className="card">
          <h2>
            <FiClock className="card-icon" /> Recent Messages
          </h2>
          {messages.length > 0 ? (
            <div className="message-list">
              {messages.map((message) => (
                <div key={message.id} className="message-preview-item">
                  <div className="message-preview-header">
                    <h3>{message.subject}</h3>
                    <span className="message-date">{message.date}</span>
                  </div>
                  <p className="message-sender">From: {message.sender}</p>
                  <p className="message-excerpt">{message.content.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">You have no messages at this time.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 