import React from 'react';

const EnvCheck = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const mode = import.meta.env.MODE;
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Environment Check</h2>
      <p><strong>Mode:</strong> {mode}</p>
      <p><strong>Backend URL:</strong> {backendUrl || 'NOT SET'}</p>
      <p><strong>All env vars:</strong></p>
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
    </div>
  );
};

export default EnvCheck;
