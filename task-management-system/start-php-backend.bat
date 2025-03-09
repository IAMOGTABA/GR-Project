@echo off
echo Starting Task Management System PHP Backend on port 5000...

REM Kill any process running on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Change to the php-backend directory
cd php-backend

REM Start PHP server in a new command window
start "PHP Server - Task Management System" cmd /k ""E:\Graduation Project 2\GR-Project\php\php.exe" -d extension_dir="E:\Graduation Project 2\GR-Project\php\ext" -d extension=mysqli -d extension=pdo_mysql -d extension=mbstring -S localhost:5000"

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