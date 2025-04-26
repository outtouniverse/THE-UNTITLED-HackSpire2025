import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.message !== 'Not authenticated') {
          setUser(data);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/api/logout';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Google OAuth Login</h1>
        {user ? (
          <div>
            <h2>Welcome, {user.displayName}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Login with Google</button>
        )}
      </header>
    </div>
  );
}

export default App; 