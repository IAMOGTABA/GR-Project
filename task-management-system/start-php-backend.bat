@echo off
echo Starting Task Management System PHP Backend on port 5000...

REM Kill any process running on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Change to the php-backend directory
cd php-backend

REM Start PHP server
php -S localhost:5000

REM Wait for user input
pause

REM Provide feedback
echo.
echo PHP Server started on http://localhost:5000
echo Your API is now running!
echo.
echo Press any key to open the API in your browser...
pause > nul
start http://localhost:5000

echo.
echo You can close this window, the server will continue running in the other command window.
echo To stop the server, close the PHP Server command window. 