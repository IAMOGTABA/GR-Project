const { exec } = require('child_process');

const ports = [3000, 5000];

ports.forEach(port => {
  // Find process using the port
  const findCommand = `netstat -ano | findstr :${port}`;
  
  exec(findCommand, (error, stdout, stderr) => {
    if (error) {
      console.log(`No process found using port ${port}`);
      return;
    }
    
    // Extract PID
    const lines = stdout.trim().split('\n');
    if (lines.length > 0) {
      const line = lines[0].trim();
      const parts = line.split(/\s+/);
      if (parts.length > 4) {
        const pid = parts[parts.length - 1];
        
        // Kill the process
        const killCommand = `taskkill /F /PID ${pid}`;
        exec(killCommand, (error, stdout, stderr) => {
          if (error) {
            console.log(`Failed to kill process using port ${port}: ${error}`);
            return;
          }
          console.log(`Successfully killed process ${pid} using port ${port}`);
        });
      }
    }
  });
}); 