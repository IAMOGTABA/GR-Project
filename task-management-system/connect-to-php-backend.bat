@echo off
echo Starting Task Management System React client connected to PHP backend...

REM Check if PHP backend is running on port 5000
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') DO (
    SET PHP_PID=%%P
)

IF NOT DEFINED PHP_PID (
    echo PHP backend is not running. Starting it now...
    
    REM Start the PHP backend first
    start "PHP Backend" cmd /c "cd .. && cd task-management-system && start-php-backend.bat"
    
    REM Wait for the backend to initialize
    echo Waiting for PHP backend to initialize...
    timeout /t 5 /nobreak > nul
) ELSE (
    echo PHP backend is already running on port 5000 (PID: %PHP_PID%)
)

REM Verify backend is running by pinging it
echo Testing connection to PHP backend...
curl -s http://localhost:5000 > nul
IF %ERRORLEVEL% NEQ 0 (
    echo Warning: Could not connect to PHP backend at http://localhost:5000
    echo The client may not function correctly without the backend.
    echo.
    echo Press any key to continue anyway or CTRL+C to cancel...
    pause > nul
)

REM Set environment variables for the React client
set REACT_APP_API_URL=http://localhost:5000
set PORT=3000

REM Navigate to the client directory
cd client

REM Start the React client app in a new command window
start "React Client - Task Management System" cmd /k "npm start"

echo.
echo React client starting on http://localhost:3000
echo Connected to PHP API at %REACT_APP_API_URL%
echo.
echo Press any key to open the client in your browser...
pause > nul
start http://localhost:3000

echo.
echo You can close this window, the client will continue running in the other command window.
echo To stop the client, close the React Client command window. 