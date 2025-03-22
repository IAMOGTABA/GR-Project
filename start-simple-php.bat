@echo off
echo Starting Simple PHP Server on port 5000...

REM Kill any process running on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process with PID: %%a
    taskkill /F /PID %%a 2>nul
)

REM Set the absolute paths for PHP
set PHP_PATH="E:\Graduation Project 2\GR-Project\php\php.exe"
set PHP_EXT_DIR="E:\Graduation Project 2\GR-Project\php\ext"

REM Start PHP server with a single file
%PHP_PATH% -d extension_dir=%PHP_EXT_DIR% -d extension=mysqli -d extension=pdo_mysql -d extension=mbstring -S localhost:5000 php-backend/simple-server.php

REM This will only run if the PHP server is stopped
echo PHP server has stopped.
pause 