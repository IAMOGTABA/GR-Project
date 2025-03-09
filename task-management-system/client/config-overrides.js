const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  return {
    ...config,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    },
    historyApiFallback: true
  };
};

module.exports = {
  webpack: override(),
  devServer: overrideDevServer(devServerConfig())
}; 