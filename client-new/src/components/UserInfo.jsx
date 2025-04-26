// UserInfo.jsx
import React from 'react';
import { useAuth } from './context/AuthContext'; // Assuming AuthContext is correctly implemented

export default function UserInfo() {
  const { user, logout } = useAuth(); // Get user and logout function from context

  // Render nothing if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="user-info"> {/* New class */}
      {/* Ensure user.profilePicture exists before rendering */}
      {user.profilePicture && (
         <img src={user.profilePicture} alt="Profile" className="profile-picture" /> // New class
      )}

      <div className="user-details"> {/* Optional wrapper for text */}
        {/* Removed Tailwind class */}
        <h2 style={{ margin: 0, color: 'var(--color-primary-dark)' }}>{user.displayName}</h2> {/* New style */}
        <p style={{ margin: 0, color: 'var(--color-text-light)' }}>{user.email}</p> {/* New style */}
      </div>

      {/* Check if logout is provided by context before rendering button */}
      {logout && (
         <button onClick={logout} className="logout-btn">Logout</button>
      )}
    </div>
  );
}