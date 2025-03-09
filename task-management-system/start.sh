#!/bin/bash

echo "Starting Task Management System PHP Backend..."

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "PHP is not installed or not in your PATH."
    echo "Please install PHP and make sure it's in your PATH."
    exit 1
fi

# Navigate to the php-backend directory
cd php-backend || exit 1

# Open the test page in the default browser
if command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8000/test.html &
elif command -v open &> /dev/null; then
    # macOS
    open http://localhost:8000/test.html &
fi

# Start PHP server
echo "Starting PHP server at http://localhost:8000"
echo "You can access the test page at http://localhost:8000/test.html"
php -S localhost:8000

echo "Server stopped." 