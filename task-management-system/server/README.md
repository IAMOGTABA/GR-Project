# Task Management System - Server

This is the backend server for the Task Management System. It provides RESTful API endpoints for tasks, users, messages, and announcements.

## Database Setup

The application can work with different types of MongoDB setups:

### 1. In-Memory MongoDB (Development/Testing)

By default, the application uses an in-memory MongoDB instance provided by `mongodb-memory-server`. This is perfect for development and testing as it doesn't require any external database setup. However, data is lost when the server restarts.

To use the in-memory database, set in your `.env` file:
```
USE_MEMORY_DB=true
```

### 2. Local MongoDB Installation

To use a local MongoDB installation:

1. [Download and install MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service
3. Update your `.env` file:
```
USE_MEMORY_DB=false
MONGODB_URI=mongodb://localhost:27017/task_management_db
```

### 3. MongoDB Atlas (Cloud)

For production or remote development, you can use MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster
3. Create a database user with appropriate permissions
4. Whitelist your IP address in the Network Access settings
5. Get your connection string from the "Connect" button
6. Update your `.env` file:
```
USE_MEMORY_DB=false
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
NODE_ENV=development
USE_MEMORY_DB=true  # Set to false to use real MongoDB
BYPASS_AUTH=true    # Set to false in production
FILE_UPLOAD_PATH=./uploads
MAX_FILE_UPLOAD=5000000
```

## Running the Server

Install dependencies:
```
npm install
```

Start the server:
```
npm start
```

Start the server in development mode with auto-restart:
```
npm run dev
``` 