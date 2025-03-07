import React, { useState, useEffect } from 'react';
import { checkHealth } from '../services/api';

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    isLoading: true,
    apiConnected: false,
    dbConnected: false,
    dbType: '',
    error: null,
    details: null
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        const healthData = await checkHealth();
        console.log('Health check response:', healthData);
        
        setConnectionStatus({
          isLoading: false,
          apiConnected: true,
          dbConnected: healthData.database.state === 1,
          dbType: healthData.database.type,
          error: null,
          details: healthData
        });
      } catch (error) {
        console.error('Connection test failed:', error);
        setConnectionStatus({
          isLoading: false,
          apiConnected: false,
          dbConnected: false,
          dbType: '',
          error: error.message || 'Failed to connect to API',
          details: null
        });
      }
    };

    testConnection();
  }, []);

  const retryConnection = () => {
    setConnectionStatus({ ...connectionStatus, isLoading: true });
    // Re-run the effect
    checkHealth()
      .then(healthData => {
        setConnectionStatus({
          isLoading: false,
          apiConnected: true,
          dbConnected: healthData.database.state === 1,
          dbType: healthData.database.type,
          error: null,
          details: healthData
        });
      })
      .catch(error => {
        setConnectionStatus({
          isLoading: false,
          apiConnected: false,
          dbConnected: false,
          dbType: '',
          error: error.message || 'Failed to connect to API',
          details: null
        });
      });
  };

  if (connectionStatus.isLoading) {
    return (
      <div className="connection-test loading">
        <h3>Testing connections...</h3>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="connection-test">
      <h3>Connection Status</h3>
      
      {connectionStatus.error ? (
        <div className="connection-error">
          <p>Error: {connectionStatus.error}</p>
          <button onClick={retryConnection}>Retry Connection</button>
        </div>
      ) : (
        <div className="connection-details">
          <div className="connection-item">
            <span className="connection-label">API Server:</span>
            <span className={`connection-status ${connectionStatus.apiConnected ? 'connected' : 'disconnected'}`}>
              {connectionStatus.apiConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="connection-item">
            <span className="connection-label">Database:</span>
            <span className={`connection-status ${connectionStatus.dbConnected ? 'connected' : 'disconnected'}`}>
              {connectionStatus.dbConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {connectionStatus.dbConnected && (
            <div className="connection-item">
              <span className="connection-label">Database Type:</span>
              <span className="connection-value">{connectionStatus.dbType}</span>
            </div>
          )}
          
          {connectionStatus.details && (
            <div className="connection-details-expandable">
              <details>
                <summary>View Details</summary>
                <pre>{JSON.stringify(connectionStatus.details, null, 2)}</pre>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionTest; 