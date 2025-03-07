import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create an axios instance with default config
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token to requests
apiClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
    response => response,
    error => {
        const { response } = error;
        
        // Handle authentication errors
        if (response && response.status === 401) {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// Health check - test API & database connection
export const checkHealth = async () => {
    try {
        const response = await apiClient.get('/api/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        throw error;
    }
};

// Auth services
export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/api/auth/login', credentials);
        if (response.data && response.data.token) {
            localStorage.setItem('userToken', response.data.token);
            localStorage.setItem('userRole', response.data.user.role);
        }
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const register = async (userData) => {
    try {
        const response = await apiClient.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get('/api/auth/me');
        return response.data;
    } catch (error) {
        console.error('Get current user failed:', error);
        throw error;
    }
};

// Task services
export const getTasks = async () => {
    try {
        const response = await apiClient.get('/api/tasks');
        return response.data;
    } catch (error) {
        console.error('Get tasks failed:', error);
        throw error;
    }
};

export const getTask = async (id) => {
    try {
        const response = await apiClient.get(`/api/tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Get task ${id} failed:`, error);
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await apiClient.post('/api/tasks', taskData);
        return response.data;
    } catch (error) {
        console.error('Create task failed:', error);
        throw error;
    }
};

// User services
export const getUsers = async () => {
    try {
        const response = await apiClient.get('/api/users');
        return response.data;
    } catch (error) {
        console.error('Get users failed:', error);
        throw error;
    }
};

// Add more API service methods as needed

export default apiClient; 