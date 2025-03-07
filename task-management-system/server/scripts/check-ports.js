const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

/**
 * Checks if a port is in use and kills the process if needed
 * @param {number} port - The port number to check
 * @returns {Promise<boolean>} - True if port is available, false if couldn't be freed
 */
async function checkAndFreePort(port) {
  try {
    console.log(`Checking if port ${port} is available...`);
    
    // For Windows systems
    const { stdout: netstatOutput } = await execAsync(`netstat -ano | findstr :${port}`);
    
    if (netstatOutput.trim() === '') {
      console.log(`Port ${port} is available.`);
      return true;
    }
    
    // Parse the PID from the output
    const lines = netstatOutput.trim().split('\n');
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
    const pids = Array.from(pidSet);
    for (const pid of pids) {
      console.log(`Port ${port} is in use by process ${pid}, attempting to kill...`);
      
      // Get process details for confirmation
      const { stdout: tasklistOutput } = await execAsync(`tasklist | findstr ${pid}`);
      console.log(`Process details: ${tasklistOutput.trim()}`);
      
      // Kill the process
      const { stdout: killOutput } = await execAsync(`taskkill /PID ${pid} /F`);
      console.log(`Kill result: ${killOutput.trim()}`);
    }
    
    // Verify the port is now available
    console.log(`Checking if port ${port} is now available...`);
    const { stdout: verifyOutput } = await execAsync(`netstat -ano | findstr :${port}`);
    
    if (verifyOutput.trim() === '') {
      console.log(`Successfully freed port ${port}.`);
      return true;
    } else {
      console.log(`Could not free port ${port}.`);
      return false;
    }
  } catch (error) {
    if (error.stderr && error.stderr.includes('could not be found')) {
      console.log(`Port ${port} is available.`);
      return true;
    }
    
    console.error(`Error checking/freeing port ${port}:`, error.message);
    return false;
  }
}

/**
 * Main function to check and free required ports
 */
async function main() {
  const requiredPorts = [3000, 5000]; // Client and server ports
  
  for (const port of requiredPorts) {
    const isAvailable = await checkAndFreePort(port);
    if (!isAvailable) {
      console.error(`WARNING: Port ${port} could not be freed. The application may not start correctly.`);
    }
  }
  
  console.log('Port check completed.');
}

// Run the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 