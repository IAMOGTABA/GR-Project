const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File Upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: process.env.MAX_FILE_UPLOAD || 5 * 1024 * 1024 },
}));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.send('Task Management System API is running');
});

// DIRECT ROUTES WITHOUT AUTHENTICATION FOR TESTING PURPOSES

// User routes
app.get('/api/users', async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Check if users collection exists
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      // Create test users if none exist
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
        department: 'management',
        position: 'System Admin'
      });
      
      await User.create({
        name: 'Test User',
        email: 'user@example.com',
        password: '123456',
        role: 'user',
        department: 'development',
        position: 'Developer'
      });
      
      console.log('Created test users');
    }
    
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.create(req.body);
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with id of ${req.params.id}`
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Task routes
app.get('/api/tasks', async (req, res) => {
  try {
    const Task = require('./models/Task');
    const tasks = await Task.find();
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error('Error getting tasks:', err);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Connect to MongoDB using MongoDB Memory Server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Create an in-memory MongoDB instance
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    console.log('Connecting to in-memory MongoDB at:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to in-memory MongoDB successfully!');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
}); 