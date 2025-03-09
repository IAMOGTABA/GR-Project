@echo off
echo Starting Task Management System with PHP Backend...

REM Start the PHP backend
call start-php-backend.bat

REM Wait for the backend to start
echo Waiting for the PHP backend to initialize...
timeout /t 3 /nobreak > nul

REM Start the React client
call connect-to-php-backend.bat

echo.
echo Task Management System started with PHP backend!
echo PHP Backend: http://localhost:5000
echo React Client: http://localhost:3000
echo.
echo Press any key to exit this window (the servers will continue running)...
pause > nul 