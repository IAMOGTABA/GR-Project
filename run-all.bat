@echo off
echo Starting Task Management System with PHP Backend...

REM Set the PHP and extension paths
set PHP_PATH="E:\Graduation Project 2\GR-Project\php\php.exe"
set PHP_EXT_DIR="E:\Graduation Project 2\GR-Project\php\ext"

REM Kill any process running on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Start PHP server in a new command window
echo Starting PHP Backend on http://localhost:5000
start "PHP Server - Task Management System" cmd /k %PHP_PATH% -d extension_dir=%PHP_EXT_DIR% -d extension=mysqli -d extension=pdo_mysql -d extension=mbstring -S localhost:5000 -t php-backend

REM Wait for the backend to start
echo Waiting for the PHP backend to initialize...
timeout /t 5 /nobreak > nul

REM Set environment variables for the React client
set REACT_APP_API_URL=http://localhost:5000
set PORT=3000

REM Start the React client app in a new command window
echo Starting React Client on http://localhost:3000
cd client
start "React Client - Task Management System" cmd /k npm start

echo.
echo Task Management System started with PHP backend!
echo PHP Backend: http://localhost:5000
echo React Client: http://localhost:3000
echo.
echo Press any key to open both in your browser...
pause > nul

REM Open in browser
start http://localhost:5000
start http://localhost:3000

echo.
echo You can close this window, the servers will continue running in their respective command windows. 