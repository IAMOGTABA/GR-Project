/**
 * Database Initialization Script
 * 
 * This script ensures the database is properly configured and populated with initial data.
 * It can be run separately or through the server's startup process.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Task = require('../models/Task');
const Announcement = require('../models/Announcement');
const Message = require('../models/Message');

// Initial admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'adminpassword',
  role: 'admin'
};

// Initial regular user
const regularUser = {
  name: 'Regular User',
  email: 'user@example.com',
  password: 'userpassword',
  role: 'user'
};

// Sample task data
const sampleTasks = [
  {
    title: 'Complete Project Setup',
    description: 'Set up the development environment and initialize the project',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    title: 'Database Integration',
    description: 'Integrate MongoDB with the application',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  },
  {
    title: 'Front-end Development',
    description: 'Develop the user interface components',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  }
];

// Sample announcement data
const sampleAnnouncements = [
  {
    title: 'Welcome to the Task Management System',
    content: 'This system will help you manage your tasks and collaborate effectively with your team.',
    isPinned: true,
  },
  {
    title: 'System Maintenance',
    content: 'The system will be down for maintenance on Saturday night from 10 PM to 2 AM.',
    isPinned: false,
  }
];

/**
 * Create initial users if they don't exist
 */
async function createInitialUsers() {
  console.log('Checking for existing users...');
  
  const adminExists = await User.findOne({ email: adminUser.email });
  const regularExists = await User.findOne({ email: regularUser.email });
  
  if (!adminExists) {
    console.log('Creating admin user...');
    await User.create(adminUser);
    console.log('Admin user created!');
  } else {
    console.log('Admin user already exists.');
  }
  
  if (!regularExists) {
    console.log('Creating regular user...');
    await User.create(regularUser);
    console.log('Regular user created!');
  } else {
    console.log('Regular user already exists.');
  }
}

/**
 * Create sample tasks if no tasks exist
 */
async function createSampleTasks() {
  console.log('Checking for existing tasks...');
  
  const taskCount = await Task.countDocuments();
  
  if (taskCount === 0) {
    console.log('Creating sample tasks...');
    
    // Get user IDs
    const admin = await User.findOne({ email: adminUser.email });
    const regular = await User.findOne({ email: regularUser.email });
    
    if (!admin || !regular) {
      console.log('Cannot create tasks: Users not found.');
      return;
    }
    
    // Assign tasks to users
    const tasksWithUsers = sampleTasks.map((task, index) => ({
      ...task,
      createdBy: admin._id,
      assignedTo: index % 2 === 0 ? regular._id : admin._id,
    }));
    
    await Task.insertMany(tasksWithUsers);
    console.log('Sample tasks created!');
  } else {
    console.log(`${taskCount} tasks already exist.`);
  }
}

/**
 * Create sample announcements if none exist
 */
async function createSampleAnnouncements() {
  console.log('Checking for existing announcements...');
  
  const announcementCount = await Announcement.countDocuments();
  
  if (announcementCount === 0) {
    console.log('Creating sample announcements...');
    
    // Get admin user ID
    const admin = await User.findOne({ email: adminUser.email });
    
    if (!admin) {
      console.log('Cannot create announcements: Admin user not found.');
      return;
    }
    
    // Add creator to announcements
    const announcementsWithCreator = sampleAnnouncements.map(announcement => ({
      ...announcement,
      createdBy: admin._id,
    }));
    
    await Announcement.insertMany(announcementsWithCreator);
    console.log('Sample announcements created!');
  } else {
    console.log(`${announcementCount} announcements already exist.`);
  }
}

/**
 * Main function to connect to database and initialize data
 */
async function initializeDatabase() {
  try {
    let mongoUri;
    let mongoServer;
    
    // Use in-memory database or real MongoDB
    if (process.env.USE_MEMORY_DB === 'true') {
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using in-memory MongoDB instance');
    } else {
      mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task_management_db';
      console.log(`Using MongoDB at: ${mongoUri}`);
    }
    
    // Connect to database
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB successfully!');
    
    // Initialize data
    await createInitialUsers();
    await createSampleTasks();
    await createSampleAnnouncements();
    
    console.log('Database initialization complete!');
    
    return { mongoServer };
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Run directly or export for server.js
if (require.main === module) {
  // Running as a script
  initializeDatabase()
    .then(({ mongoServer }) => {
      console.log('Done!');
      // Close the connection
      mongoose.connection.close();
      if (mongoServer) {
        mongoServer.stop();
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
} else {
  // Export for server.js
  module.exports = initializeDatabase;
} 