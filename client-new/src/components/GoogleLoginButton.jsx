// GoogleLoginButton.jsx
import React from 'react';
// Ensure your AuthContext has the logout function if needed here,
// although it's primarily used in UserInfo.
// import { useAuth } from './context/AuthContext'; // Potentially add if needed for context

const BACKEND_URL = 'http://localhost:3000'; // Make sure this is correct

export default function GoogleLoginButton() {
  // If useAuth was needed, you'd get it here: const { user, login, logout } = useAuth();

  const handleGoogleSignIn = () => {
    // This performs the redirect to your backend's Google OAuth endpoint
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="google-login-container"> {/* Using the new class */}
      <h2>Sign in to continue</h2>
      <button
        onClick={handleGoogleSignIn}
        className="google-login-button" // Using the new class
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: '24px', height: '24px', marginRight: '12px', color:'black' }} // Using small inline styles for icon
        />
        Sign in with Google
      </button>
    </div>
  );
}