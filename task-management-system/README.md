# Task Management System

A full-featured task management application built with the MERN stack (MongoDB, Express, React, Node.js). The system allows for task assignment, tracking, user management, and notifications.

## Features

- **Task Management**: Create, assign, update, and delete tasks
- **User Management**: Admin can manage users, update roles and permissions
- **Notifications**: System-wide notifications for task updates and important announcements
- **Responsive Design**: Works on desktops, tablets, and mobile devices

## Tech Stack

- **Frontend**: React.js, React Router, CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```
   git clone [repository-url]
   cd task-management-system
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task_management_db
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=30d
   ```

### Running the Application

1. Start the MongoDB server (if using local instance)

2. Start the server:
   ```
   cd server
   npm start
   ```

3. Start the client in a new terminal:
   ```
   cd client
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Default Accounts

The system comes with pre-created test accounts:

- **Admin**: admin@example.com (Password: 123456)
- **User**: user@example.com (Password: 123456)

## License

This project is licensed under the MIT License. 