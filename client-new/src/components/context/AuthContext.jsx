// AuthContext.jsx file 

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:3001';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/auth/current-user`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : { user: null })
      .then(data => setUser(data.user));
  }, []);

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, { method: 'GET', credentials: 'include' });
    setUser(null);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 
