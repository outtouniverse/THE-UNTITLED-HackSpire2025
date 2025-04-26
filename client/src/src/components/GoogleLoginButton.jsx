// GoogleLoginButton.jsx file 

import React from 'react';

const BACKEND_URL = 'http://localhost:3000';

export default function GoogleLoginButton() {
  const handleGoogleSignIn = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h2>Sign in to continue</h2>
      <button
        onClick={handleGoogleSignIn}
        style={{
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 6,
          padding: '12px 28px',
          fontSize: 18,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
        }}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: 28, height: 28, marginRight: 12 }}
        />
        Sign in with Google
      </button>
    </div>
  );
} 