const { exec } = require('child_process');

// Wait 10 seconds for the application to start up
console.log('Waiting for the application to start...');
setTimeout(() => {
  console.log('Opening browser to http://localhost:3000');
  // Use the appropriate command based on the OS
  const command = process.platform === 'win32' ? 
    'start http://localhost:3000' :
    'open http://localhost:3000';
  
  exec(command, (error) => {
    if (error) {
      console.error(`Error opening browser: ${error}`);
      return;
    }
    console.log('Browser opened successfully');
  });
}, 10000); 