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
app.use(cors());
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

// API routes
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection by performing a simple operation
    const dbStatus = mongoose.connection.readyState;
    /*
      0 = disconnected
      1 = connected
      2 = connecting
      3 = disconnecting
    */
    let dbStatusText;
    switch(dbStatus) {
      case 0:
        dbStatusText = 'Disconnected';
        break;
      case 1:
        dbStatusText = 'Connected';
        break;
      case 2:
        dbStatusText = 'Connecting';
        break;
      case 3:
        dbStatusText = 'Disconnecting';
        break;
      default:
        dbStatusText = 'Unknown';
    }

    // Perform a simple database operation to verify connectivity
    let testResult = false;
    try {
      const Test = mongoose.model('ConnectionTest', 
        new mongoose.Schema({ name: String, date: { type: Date, default: Date.now } })
      );
      await Test.findOne({});
      testResult = true;
    } catch(err) {
      console.error('Database test operation failed:', err.message);
    }

    res.status(200).json({ 
      status: 'API is running', 
      database: {
        state: dbStatus,
        status: dbStatusText,
        type: process.env.USE_MEMORY_DB === 'true' ? 'In-Memory MongoDB' : 'MongoDB',
        testResult: testResult ? 'Successful' : 'Failed'
      },
      timestamp: new Date()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Error', 
      error: err.message,
      timestamp: new Date()
    });
  }
});

// Connect to Database
const PORT = process.env.PORT || 5000;
let server;
let mongoServer;

// Import database initialization script
const initializeDatabase = require('./scripts/ensure-db');

async function startServer() {
  try {
    console.log('Starting server in', process.env.NODE_ENV, 'mode');
    
    // Initialize database with the script
    const result = await initializeDatabase();
    if (result && result.mongoServer) {
      mongoServer = result.mongoServer;
    }
    
    // Start Express server
    server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

    // Handle shutdown gracefully
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Graceful shutdown function
function shutDown() {
  console.log('Received kill signal, shutting down gracefully');
  if (server) {
    server.close(() => {
      console.log('Server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
}

startServer();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Open Developer Console in your browser and run:
fetch('http://localhost:5000/api/health')
  .then(response => response.json())
  .then(data => console.log('Database status:', data.database))
  .catch(error => console.error('Error checking database:', error)); 