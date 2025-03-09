@echo off
echo Starting Task Management System React client connected to PHP backend...

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