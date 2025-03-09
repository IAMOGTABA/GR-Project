$phpPath = "E:\Graduation Project 2\GR-Project\php\php.exe"
$docRoot = "E:\Graduation Project 2\GR-Project\task-management-system\php-backend"

Write-Host "Starting PHP Server at http://localhost:9000/"
Write-Host "Press Ctrl+C to stop the server."

& $phpPath -S "localhost:9000" -t $docRoot 