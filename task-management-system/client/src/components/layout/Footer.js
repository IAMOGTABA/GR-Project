import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>Task Management System &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer; 