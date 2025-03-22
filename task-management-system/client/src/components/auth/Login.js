import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiLoader } from 'react-icons/fi';
import { authService } from '../../services/api';

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use our API service for login
      const result = await authService.login(formData);
      
      if (result.success) {
        // Update authentication state in parent component
        if (setIsAuthenticated) {
          setIsAuthenticated(true);
        }
        
        setLoading(false);
        navigate('/dashboard');
        
        console.log('Login successful. Token set in localStorage:', localStorage.getItem('userToken'));
      } else {
        setLoading(false);
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  // Fallback to demo login if API is not available
  const demoLogin = () => {
    setError('');
    setLoading(true);
    
    // Check for admin user
    let userRole = 'employee';
    let userName = email.split('@')[0] || email;
    
    // Predefined admin user
    if (email === 'admin@example.com' && password === 'admin123') {
      userRole = 'admin';
    } else if (email === 'employee@example.com' && password === 'employee123') {
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
    
    console.log('Demo login successful.');
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
              type="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              value={email}
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
        <button
          type="button"
          className="btn btn-secondary"
          onClick={demoLogin}
          disabled={loading}
        >
          Use Demo Login
        </button>
      </form>
      <div className="auth-redirect">
        <p>
          Don't have an account? <a href="#">Contact Administrator</a>
        </p>
        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Admin: email=admin@example.com, password=admin123</p>
          <p>Employee: email=employee@example.com, password=employee123</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 