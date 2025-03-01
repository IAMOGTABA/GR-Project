# Task Management System - Frontend

This is the frontend application for the Task Management System, built with React.

## Features

- Modern UI with responsive design
- Task management interface
- File upload functionality for task attachments
- User authentication and authorization

## Technologies Used

- React.js
- React Router for navigation
- Axios for API requests
- React Icons for UI elements

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Navigate to the client directory
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

The application will be available at http://localhost:3000

## Project Structure

- `src/components/layout`: Layout components like Navbar and Footer
- `src/components/pages`: Page components
- `src/components/tasks`: Task-related components
- `src/components/auth`: Authentication components

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## API Integration

The frontend communicates with the backend API at http://localhost:5000. The proxy is configured in package.json.
