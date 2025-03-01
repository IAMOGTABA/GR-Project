# Task Management System

A comprehensive task management system with admin and user roles, messaging, announcements, and file attachments.

## Features

- **User Authentication**: Secure login and registration with JWT
- **Role-Based Access Control**: Admin and regular user roles
- **Task Management**: Create, assign, update, and track tasks
- **User Management**: Admin can manage users (add, edit, delete)
- **Messaging System**: Direct messaging between users
- **Announcements**: Company-wide or targeted announcements
- **File Attachments**: Upload files to tasks, messages, and announcements
- **Task Comments**: Discussions within tasks
- **Task Prioritization**: Set priority levels for tasks
- **Task Categories**: Organize tasks by departments or projects
- **Deadline Management**: Set due dates with tracking
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: React.js with Material UI (coming soon)

## Project Structure

```
task-management-system/
├── client/                 # Frontend React application (coming soon)
└── server/                 # Backend Express API
    ├── controllers/        # Route controllers
    ├── middleware/         # Custom middleware
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── uploads/            # File uploads
    ├── .env                # Environment variables
    ├── package.json        # Dependencies
    └── server.js           # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Server Setup

1. Navigate to the server directory:
   ```
   cd task-management-system/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-management-system
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   NODE_ENV=development
   FILE_UPLOAD_PATH=./uploads
   MAX_FILE_UPLOAD=5000000  # 5MB in bytes
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Client Setup (Coming Soon)

The frontend React application will be implemented in the next phase.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user (admin only)
- `POST /api/users` - Create user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/:id/avatar` - Upload user avatar

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task (admin only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (admin only)
- `POST /api/tasks/:id/comments` - Add comment to task
- `POST /api/tasks/:id/attachments` - Upload task attachment

### Messages
- `GET /api/messages` - Get all messages for user
- `GET /api/messages/:id` - Get single message
- `POST /api/messages` - Create message
- `DELETE /api/messages/:id` - Delete message
- `POST /api/messages/:id/attachments` - Upload message attachment

### Announcements
- `GET /api/announcements` - Get all announcements
- `GET /api/announcements/:id` - Get single announcement
- `POST /api/announcements` - Create announcement (admin only)
- `PUT /api/announcements/:id` - Update announcement (admin only)
- `DELETE /api/announcements/:id` - Delete announcement (admin only)
- `POST /api/announcements/:id/attachments` - Upload announcement attachment (admin only)

## License

This project is licensed under the MIT License. 