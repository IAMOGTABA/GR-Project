@echo off
echo Starting PHP Server for Task Management System...

cd php-backend
start cmd /k ""E:\Graduation Project 2\GR-Project\php\php.exe" -S localhost:8000"

echo PHP Server started at http://localhost:8000
echo Press any key to open the browser...
pause > nul
start http://localhost:8000 