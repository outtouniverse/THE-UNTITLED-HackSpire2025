// UserInfo.jsx file 

import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserInfo() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="user-info">
      <img src={user.profilePicture} alt="Profile" className="profile-picture" />
      <div>
        <h2 style={{ margin: 0 }}>{user.displayName}</h2>
        <p style={{ margin: 0, color: '#888' }}>{user.email}</p>
      </div>
      <button onClick={logout} className="logout-btn">Logout</button>
    </div>
  );
} 