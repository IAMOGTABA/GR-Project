@echo off
echo Starting Task Management System...

start cmd /k "cd task-management-system\server && npm start"
timeout /t 5
start cmd /k "cd task-management-system\client && set PORT=3000 && npm start"

echo Server and client applications started in separate windows. 