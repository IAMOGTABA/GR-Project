import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Task Management System</h1>
      <p>Manage your team's tasks efficiently with our powerful platform</p>
      
      <div className="buttons">
        <Link to="/upload" className="btn btn-primary">
          Upload Task Attachment
        </Link>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Task Management</h3>
          <p>Create, assign, and track tasks with ease. Set priorities, deadlines, and categories.</p>
        </div>
        
        <div className="feature-card">
          <h3>File Attachments</h3>
          <p>Upload and manage files related to your tasks. Share documents with your team.</p>
        </div>
        
        <div className="feature-card">
          <h3>Team Collaboration</h3>
          <p>Work together with your team. Comment on tasks and share updates.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 