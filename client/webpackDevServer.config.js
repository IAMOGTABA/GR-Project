const path = require('path');
const fs = require('fs');

module.exports = function() {
  return {
    allowedHosts: 'all',
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    historyApiFallback: true,
    compress: true,
    hot: true,
    client: {
      webSocketURL: 'ws://localhost:3000/ws',
    }
  };
}; 