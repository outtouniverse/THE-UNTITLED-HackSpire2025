import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import Home from './Home';
import Emotion from './Emotion';

function AppRoutes() {
  const { user, logout } = useAuth();

  // If not logged in, show login
  if (!user) {
    return <GoogleLoginButton />;
  }

  // If logged in, show the app with routes
  return (
    <>
      {/* Optional: Show user info and logout at the top */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        padding: '16px 32px 0 0'
      }}>
        <span style={{ marginRight: 16, color: '#1976d2', fontWeight: 500 }}>
          {user.displayName} ({user.email})
        </span>
        <button
          onClick={logout}
          style={{
            background: '#e53935', color: '#fff', border: 'none', borderRadius: 6,
            padding: '8px 18px', fontWeight: 500, cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mood" element={<Emotion />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}