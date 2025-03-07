const { exec, spawn } = require('child_process');
const path = require('path');

// Function to check and free ports
async function checkAndFreePort(port) {
  console.log(`Checking if port ${port} is available...`);
  
  try {
    // For Windows systems
    const { stdout } = await new Promise((resolve, reject) => {
      exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
        if (error && error.code !== 1) { // code 1 means no results found (port is available)
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
    
    if (!stdout.trim()) {
      console.log(`Port ${port} is available.`);
      return true;
    }
    
    // Parse the PID from the output
    const lines = stdout.trim().split('\n');
    const pidSet = new Set();
    
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const pid = parts[4];
        if (pid && !isNaN(parseInt(pid))) {
          pidSet.add(pid);
        }
      }
    });
    
    if (pidSet.size === 0) {
      console.log(`Could not find PID for port ${port}.`);
      return false;
    }
    
    // Kill each process that's using the port
    for (const pid of Array.from(pidSet)) {
      console.log(`Port ${port} is in use by process ${pid}, attempting to kill...`);
      
      try {
        await new Promise((resolve, reject) => {
          exec(`taskkill /PID ${pid} /F`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Failed to kill process ${pid}:`, error.message);
            } else {
              console.log(`Process ${pid} killed successfully.`);
            }
            resolve(); // Always resolve to continue with next process
          });
        });
      } catch (killError) {
        console.error(`Error killing process ${pid}:`, killError.message);
      }
    }
    
    // Verify the port is now available
    const { stdout: verifyStdout } = await new Promise((resolve, reject) => {
      exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
        if (error && error.code !== 1) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
    
    if (!verifyStdout.trim()) {
      console.log(`Successfully freed port ${port}.`);
      return true;
    } else {
      console.log(`Could not free port ${port}. The application may not run properly.`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking/freeing port ${port}:`, error.message);
    return false;
  }
}

// Function to start the server
function startServer() {
  return new Promise((resolve, reject) => {
    console.log("Starting server...");
    const serverProcess = spawn(
      process.platform === 'win32' ? 'cmd.exe' : 'sh',
      process.platform === 'win32' ? ['/c', 'cd task-management-system\\server && npm start'] : ['-c', 'cd task-management-system/server && npm start'],
      { stdio: 'inherit' }
    );
    
    serverProcess.on('error', (error) => {
      console.error('Failed to start server:', error);
      reject(error);
    });
    
    // We need to give the server some time to start up before resolving
    setTimeout(() => {
      resolve(serverProcess);
    }, 5000);
  });
}

// Function to start the client
function startClient() {
  console.log("Starting client...");
  const clientProcess = spawn(
    process.platform === 'win32' ? 'cmd.exe' : 'sh',
    process.platform === 'win32' ? ['/c', 'cd task-management-system\\client && npm start'] : ['-c', 'cd task-management-system/client && npm start'],
    { stdio: 'inherit' }
  );
  
  clientProcess.on('error', (error) => {
    console.error('Failed to start client:', error);
  });
  
  return clientProcess;
}

// Main function
async function main() {
  try {
    // Check and free ports
    console.log("Checking ports...");
    await checkAndFreePort(3000); // Client port
    await checkAndFreePort(5000); // Server port
    
    // Start server and wait for it to initialize
    await startServer();
    
    // Start client
    startClient();
    
    console.log("Application started!");
    console.log("Server running on: http://localhost:5000");
    console.log("Client running on: http://localhost:3000");
    console.log("Please wait for a few moments for the client to build.");
  } catch (error) {
    console.error('Failed to start the application:', error);
    process.exit(1);
  }
}

// Run the script
main(); 