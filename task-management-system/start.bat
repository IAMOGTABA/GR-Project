@echo off
echo Starting Task Management System PHP Backend...

REM Use the specific PHP path
set PHP_PATH=E:\Graduation Project 2\GR-Project\php\php.exe

REM Check if PHP executable exists
if not exist "%PHP_PATH%" (
    echo PHP executable not found at %PHP_PATH%
    echo Please make sure PHP is installed correctly.
    pause
    exit /b
)

REM Navigate to the php-backend directory
cd php-backend

REM Start PHP server
echo Starting PHP server at http://localhost:8000
echo You can access the test page at http://localhost:8000/test.html
start "" http://localhost:8000/test.html
"%PHP_PATH%" -c php.ini -S localhost:8000

echo Server stopped.
pause 