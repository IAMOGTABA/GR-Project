@echo off
echo Fixing Task Management System Setup...

REM Kill any process running on port 5000 (PHP backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Kill any process running on port 3000 (React client)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Set the absolute paths for PHP
set PHP_PATH="E:\Graduation Project 2\GR-Project\php\php.exe"
set PHP_EXT_DIR="E:\Graduation Project 2\GR-Project\php\ext"

REM Start PHP server directly
echo Starting PHP backend on port 5000...
cd php-backend
start "PHP Backend" cmd /k %PHP_PATH% -d extension_dir=%PHP_EXT_DIR% -d extension=mysqli -d extension=pdo_mysql -d extension=mbstring -S localhost:5000

REM Wait for PHP server to start
timeout /t 5 /nobreak

REM Set environment variables for React
set REACT_APP_API_URL=http://localhost:5000

REM Start React app
echo Starting React client on port 3000...
cd ..
cd client
start "React Client" cmd /k npm start

REM Wait for React to start
timeout /t 10 /nobreak

REM Open browser windows
echo Opening browser windows...
start http://localhost:5000
start http://localhost:3000

echo.
echo Setup complete! Both servers should be running.
echo PHP Backend: http://localhost:5000
echo React Client: http://localhost:3000
echo.
echo You can close this window, but keep the other command windows open to keep the servers running.
pause 