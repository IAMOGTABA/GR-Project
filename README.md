# Task Management System

## Overview
A full-stack task management system built with the MERN stack (MongoDB, Express, React, Node.js). This system allows for task management, user authentication, messaging, and announcements.

## Features
- User authentication and authorization
- Task creation, assignment, and tracking
- User management (admin and regular users)
- Messaging between users
- Announcements system
- File uploads

## Prerequisites
- Node.js (>= 14.x)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Project Structure
- `task-management-system/client`: React frontend
- `task-management-system/server`: Express backend

## Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd task-management-system
```

### 2. Install dependencies for the root project, client, and server
```bash
# Install root dependencies
npm install

# Install server dependencies
cd task-management-system/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure environment variables

#### Server (.env file in server directory)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
NODE_ENV=development
USE_MEMORY_DB=true  # Set to true to use in-memory MongoDB, false to use real MongoDB
BYPASS_AUTH=true    # Set to true to bypass authentication in development
FILE_UPLOAD_PATH=./uploads
MAX_FILE_UPLOAD=5000000
```

#### Client (.env file in client directory)
```
PORT=3000
BROWSER=none
DANGEROUSLY_DISABLE_HOST_CHECK=true
WDS_SOCKET_HOST=127.0.0.1
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start the development server
```bash
# From the root directory
npm start
```

This command will start both the backend server (on port 5000) and the frontend client (on port 3000) concurrently.

## Development Notes

### Backend
- The backend uses Express.js with MongoDB
- Authentication is handled via JWT
- In development mode, you can choose to use a real MongoDB database or an in-memory MongoDB instance
- Authentication can be bypassed in development mode for easier testing

### Frontend
- The frontend is built with React
- It uses modern hooks and functional components
- Material-UI is used for styling
- Axios is used for API calls

## Troubleshooting

### Port already in use
If you encounter an error saying the port is already in use:

```bash
# Check what's using the port (Windows)
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F

# Check what's using the port (Mac/Linux)
lsof -i :<PORT>
kill -9 <PID>
```

## License
ISC 
