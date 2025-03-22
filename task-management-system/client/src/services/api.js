import axios from 'axios';

// Create a base axios instance for our API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized - redirect to login
      if (error.response.status === 401) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth services
const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      if (response.data.success && response.data.data.token) {
        // Store token and user info
        localStorage.setItem('userToken', response.data.data.token);
        localStorage.setItem('userRole', response.data.data.user.role);
        localStorage.setItem('userName', response.data.data.user.name);
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  }
};

// User services
const userService = {
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  createUser: async (userData) => {
    try {
      const response = await api.post('/api/users/create', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/api/users/update/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/users/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  }
};

// Task services
const taskService = {
  getAllTasks: async () => {
    try {
      const response = await api.get('/api/tasks');
      return response.data;
    } catch (error) {
      console.error('Get tasks error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get task error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  createTask: async (taskData) => {
    try {
      const response = await api.post('/api/tasks/create', taskData);
      return response.data;
    } catch (error) {
      console.error('Create task error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server',
        errors: error.response?.data?.data || []
      };
    }
  },
  
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/api/tasks/update/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Update task error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server',
        errors: error.response?.data?.errors || []
      };
    }
  },
  
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/api/tasks/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete task error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  getTasksByUser: async (userId) => {
    try {
      const response = await api.get(`/api/tasks?user_id=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get user tasks error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  },
  
  getTasksByStatus: async (status) => {
    try {
      const response = await api.get(`/api/tasks?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Get tasks by status error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error connecting to server' 
      };
    }
  }
};

export { api, authService, userService, taskService }; 