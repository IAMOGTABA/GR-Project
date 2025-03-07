# Function to check and free port
function Check-AndFreePort {
    param (
        [int]$Port
    )
    
    Write-Host "Checking if port $Port is available..."
    
    try {
        # Check if port is in use
        $connections = netstat -ano | Select-String ":$Port "
        
        if (-not $connections) {
            Write-Host "Port $Port is available."
            return $true
        }
        
        # Parse the PID from the output
        $pidSet = @()
        
        $connections | ForEach-Object {
            $parts = $_ -split '\s+', 6
            if ($parts.Length -ge 5) {
                $pid = $parts[5]
                if ($pid -and $pid -match "^\d+$") {
                    if (-not ($pidSet -contains $pid)) {
                        $pidSet += $pid
                    }
                }
            }
        }
        
        if ($pidSet.Count -eq 0) {
            Write-Host "Could not find PID for port $Port."
            return $false
        }
        
        # Kill each process that's using the port
        foreach ($pid in $pidSet) {
            Write-Host "Port $Port is in use by process $pid, attempting to kill..."
            
            # Get process details for confirmation
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Process details: $($process.Name) (PID: $pid)"
                
                # Kill the process
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
                if ($?) {
                    Write-Host "Successfully killed process $pid"
                } else {
                    Write-Host "Failed to kill process $pid"
                }
            } else {
                Write-Host "Process with PID $pid not found or already terminated."
            }
        }
        
        # Wait a moment for the ports to be released
        Start-Sleep -Seconds 2
        
        # Verify the port is now available
        $verifyConnections = netstat -ano | Select-String ":$Port "
        
        if (-not $verifyConnections) {
            Write-Host "Successfully freed port $Port."
            return $true
        } else {
            Write-Host "Could not free port $Port. The application may not run properly."
            return $false
        }
    } catch {
        Write-Host "Error checking port $Port: $_"
        return $false
    }
}

# Main Script
Write-Host "Starting Task Management System..." -ForegroundColor Cyan

# Check and free required ports
Check-AndFreePort -Port 3000
Check-AndFreePort -Port 5000

# Create server window
Write-Host "Starting server..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd task-management-system\server && npm start" -PassThru

# Wait a bit for server to initialize
Write-Host "Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Create client window
Write-Host "Starting client..." -ForegroundColor Green
$clientProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd task-management-system\client && npm start" -PassThru

Write-Host "Application started!" -ForegroundColor Cyan
Write-Host "Server running on: http://localhost:5000" -ForegroundColor Green
Write-Host "Client running on: http://localhost:3000" -ForegroundColor Green
Write-Host "Please wait for a few moments for the client to build." -ForegroundColor Yellow
Write-Host "NOTE: The client may fail to start if the server has not fully initialized. If this happens, please try again in a few seconds." -ForegroundColor Yellow 