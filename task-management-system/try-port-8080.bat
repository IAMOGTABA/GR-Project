@echo off
echo Starting Task Management System PHP Backend on port 8080...

cd php-backend
"E:\Graduation Project 2\GR-Project\php\php.exe" -d extension_dir="E:\Graduation Project 2\GR-Project\php\ext" -d extension=mysqli -d extension=pdo_mysql -d extension=mbstring -S localhost:8080 