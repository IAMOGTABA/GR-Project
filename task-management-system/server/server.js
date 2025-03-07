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

// Connect to Database
const PORT = process.env.PORT || 5000;
let server;
let mongoServer;

async function startServer() {
  try {
    // Set Mongoose options
    mongoose.set('strictQuery', false);
    
    // Determine database connection method based on environment
    let mongoUri;

    if (process.env.NODE_ENV === 'development' && process.env.USE_MEMORY_DB === 'true') {
      // Use in-memory MongoDB for development/testing
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Connecting to in-memory MongoDB at:', mongoUri);
    } else {
      // Use real MongoDB database
      mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management-system';
      console.log('Connecting to MongoDB at:', mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//******:******@')); // Hide credentials in logs
    }
    
    // Set up connection options with proper timeouts and retry settings
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    // Connect to MongoDB
    await mongoose.connect(mongoUri, mongooseOptions);
    
    console.log('Connected to MongoDB successfully!');
    
    // Create test document to verify write access
    if (process.env.NODE_ENV === 'development' && process.env.USE_MEMORY_DB !== 'true') {
      try {
        const Test = mongoose.model('ConnectionTest', 
          new mongoose.Schema({ name: String, date: { type: Date, default: Date.now } })
        );
        await Test.create({ name: 'Connection Test' });
        console.log('Successfully created test document in database!');
        
        // Clean up test collection
        await mongoose.connection.dropCollection('connectiontests');
      } catch (testErr) {
        console.warn('Database connection successful, but write test failed:', testErr.message);
      }
    }
    
    server = app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

    // Handle shutdown gracefully
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    if (err.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check:');
      console.error('1. Network connectivity to MongoDB server');
      console.error('2. Correct credentials in connection string');
      console.error('3. IP address whitelist in MongoDB Atlas (might need to add your current IP)');
      console.error('4. Database user has proper access rights');
    }
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