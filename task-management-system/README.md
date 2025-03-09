# Task Management System

A comprehensive task management system with PHP backend and RESTful API.

## Project Structure

```
task-management-system/
├── php-backend/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.php
│   │   │   └── register.php
│   │   ├── tasks/
│   │   │   ├── create.php
│   │   │   ├── delete.php
│   │   │   ├── read.php
│   │   │   ├── read_single.php
│   │   │   └── update.php
│   │   └── users/
│   │       ├── create.php
│   │       ├── delete.php
│   │       ├── read.php
│   │       ├── read_single.php
│   │       └── update.php
│   ├── config/
│   │   ├── config.php
│   │   ├── database.php
│   │   └── schema.sql
│   ├── models/
│   │   ├── Task.php
│   │   └── User.php
│   ├── utils/
│   │   └── JWT.php
│   └── index.php
└── README.md
```

## Setup Instructions

1. **Database Setup**
   - Create a MySQL database
   - Import the schema from `php-backend/config/schema.sql`
   - Update database credentials in `php-backend/config/config.php`

2. **Server Configuration**
   - Configure your web server (Apache/Nginx) to point to the `php-backend` directory
   - Ensure PHP 7.4+ is installed with PDO and MySQL extensions enabled

3. **API Testing**
   - Access the API at `http://your-server/`
   - Use the endpoints documented below

## API Endpoints

### Authentication

- **Login**: `POST /api/auth/login.php`
  - Request: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "success": true, "token": "JWT_TOKEN", "user": { ... } }`

- **Register**: `POST /api/auth/register.php`
  - Request: `{ "name": "User Name", "email": "user@example.com", "password": "password" }`
  - Response: `{ "success": true, "message": "User created", "user": { ... } }`

### Users

- **Get All Users**: `GET /api/users/read.php`
- **Get Single User**: `GET /api/users/read_single.php?id=1`
- **Create User**: `POST /api/users/create.php`
- **Update User**: `PUT /api/users/update.php`
- **Delete User**: `DELETE /api/users/delete.php`

### Tasks

- **Get All Tasks**: `GET /api/tasks/read.php`
- **Get Tasks by User**: `GET /api/tasks/read.php?user_id=1`
- **Get Tasks by Status**: `GET /api/tasks/read.php?status=pending`
- **Search Tasks**: `GET /api/tasks/read.php?search=keyword`
- **Get Single Task**: `GET /api/tasks/read_single.php?id=1`
- **Create Task**: `POST /api/tasks/create.php`
  - Request: `{ "title": "Task Title", "description": "Task Description", "due_date": "2023-12-31", "priority": "high", "status": "pending", "created_by": 1 }`
- **Update Task**: `PUT /api/tasks/update.php`
- **Delete Task**: `DELETE /api/tasks/delete.php`

## Authentication

All endpoints except login and register require authentication using JWT token.
Include the token in the request header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Error Handling

All API responses follow this structure:
```json
{
  "success": true|false,
  "message": "Success or error message",
  "data": { ... } // Optional data object
}
```

## Default Users

The schema includes two default users:
- Admin: admin@example.com / admin123
- User: user@example.com / user123

## License

This project is licensed under the MIT License. 