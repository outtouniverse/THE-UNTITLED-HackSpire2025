import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';
import Home from './Home';
import Emotion from './Emotion';
import JournalView from './JournalView';
import AnalysisView from './AnalysisView';
import Garden from './Garden';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <GoogleLoginButton />} />
      <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
      <Route path="/mood" element={user ? <Emotion /> : <Navigate to="/" />} />
      <Route path="/journal" element={user ? <JournalView /> : <Navigate to="/" />} />
      <Route path="/analysis" element={ <AnalysisView /> } />
      <Route path="/garden" element={ <Garden /> } />
      <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
          background: 'linear-gradient(145deg, #fff0f5 0%, #e6e6fa 100%)',
        }}>
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}