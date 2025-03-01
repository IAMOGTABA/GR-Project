const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');

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

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');
const messageRoutes = require('./routes/message.routes');
const announcementRoutes = require('./routes/announcement.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Task Management System API is running');
});

// Direct route for users (bypassing middleware for testing)
app.get('/api/users/public', async (req, res) => {
  try {
    const User = require('./models/User');
    
    // Check if any users exist, if not, create test users
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      // Create test admin user
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '123456',
        role: 'admin',
        department: 'management',
        position: 'System Administrator',
        phone: '555-1234'
      });
      
      // Create test regular user
      await User.create({
        name: 'Test User',
        email: 'user@example.com',
        password: '123456',
        role: 'user',
        department: 'development',
        position: 'Developer',
        phone: '555-5678'
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
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-management-system';

console.log('Attempting to connect to MongoDB at:', MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
}); 