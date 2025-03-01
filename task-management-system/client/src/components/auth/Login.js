import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiLock, FiLoader } from 'react-icons/fi';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For demo purposes, let's simulate login
      // In a real app, this would make an API call to your backend
      // const res = await axios.post('/api/auth/login', formData);
      
      setTimeout(() => {
        // Check for admin user
        let userRole = 'employee';
        let userName = username;
        
        // Predefined admin user
        if (username === 'admin' && password === 'admin123') {
          userRole = 'admin';
        } else if (username === 'employee' && password === 'employee123') {
          userRole = 'employee';
        } else {
          // In a demo, allow any username/password with minimum length
          if (password.length < 6) {
            setLoading(false);
            setError('Password must be at least 6 characters');
            return;
          }
        }
        
        // Store user info in localStorage or context
        localStorage.setItem('userToken', 'demo-token');
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userName', userName);
        
        // Update authentication state in parent component
        if (setIsAuthenticated) {
          setIsAuthenticated(true);
        }
        
        setLoading(false);
        navigate('/dashboard');
        
        console.log('Login successful. Token set in localStorage:', localStorage.getItem('userToken'));
      }, 1000);
      
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to Task Management System</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <div className="input-group">
            <span className="input-icon"><FiUser /></span>
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="input-group">
            <span className="input-icon"><FiLock /></span>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
              minLength="6"
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span>
              <FiLoader className="spin-icon" /> Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>
      </form>
      <div className="auth-redirect">
        <p>
          Don't have an account? <a href="#">Contact Administrator</a>
        </p>
        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: username=admin, password=admin123</p>
          <p>Employee: username=employee, password=employee123</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 