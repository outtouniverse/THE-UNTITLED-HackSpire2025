// UserInfo.jsx
import React from 'react';
import { useAuth } from './context/AuthContext'; // Assuming AuthContext is correctly implemented

export default function UserInfo() {
  const { user, logout } = useAuth(); // Get user and logout function from context

  // Render nothing if user is not logged in
  if (!user) {
    return null;
  }

  // Styles for the Left Sidebar
  const sidebarStyle = {
    // --- Layout & Positioning ---
    position: 'fixed', // Fixes it to the viewport
    left: 0,
    top: 0,
    height: '100vh', // Full viewport height
    width: '7%',    // 10% of viewport width (consider min/max width for responsiveness)
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    alignItems: 'center',    // Center items horizontally
    padding: '25px 10px', // Vertical padding, less horizontal
    gap: '20px', // Space between elements vertically

    // --- Aesthetic Styling ---
    background: 'rgba(30, 30, 50, 0.7)', // Darker, slightly more opaque background
    backdropFilter: 'blur(15px)', // Stronger blur for sidebar
    WebkitBackdropFilter: 'blur(15px)',
    borderRight: '1px solid rgba(71, 71, 135, 0.2)', // Border on the right edge
    boxShadow: '5px 0px 25px rgba(0, 0, 0, 0.3)', // Shadow on the right
    fontFamily: "'Inter', sans-serif",
    color: '#f5f5f5',
    boxSizing: 'border-box', // Include padding/border in width/height calculation
    zIndex: 500, // Ensure it's above some content but potentially below modals
  };

  const avatarStyle = {
    width: '60%', // Make avatar size relative to sidebar width
    maxWidth: '80px', // Max size for large screens
    aspectRatio: '1 / 1', // Maintain circular shape
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #474787', // Purple border
    boxShadow: '0 0 15px rgba(71, 71, 135, 0.5)',
    marginBottom: '10px', // Space below avatar
  };

  const userDetailsStyle = {
    textAlign: 'center', // Center text below avatar
    wordBreak: 'break-word', // Prevent long names/emails from overflowing
  };

  const displayNameStyle = {
    margin: '0 0 5px 0', // Add margin below name
    color: '#f5f5f5',
    fontWeight: 600, // Bolder name
    fontSize: '1rem', // Adjust size as needed
  };

  const emailStyle = {
    margin: 0,
    color: '#b8b8b8',
    fontSize: '0.8rem',
    fontWeight: 300,
  };

  const logoutButtonStyle = {
    marginTop: 'auto', // <<< Pushes the button to the bottom
    width: '85%', // Make button slightly smaller than sidebar width
    maxWidth: '150px',
    background: 'rgba(22, 165, 150, 0.2)', // More subtle background
    color: '#16a596',
    border: '1px solid rgba(22, 165, 150, 0.5)',
    borderRadius: '8px', // Less round
    padding: '10px 15px',
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'background 0.3s ease, color 0.3s ease',
    fontSize: '0.9rem', // Smaller font size
  };

  return (
    // Apply the sidebar styles to the main div
    <div className="user-info-sidebar" style={sidebarStyle}>

      {/* Avatar */}
      {user.profilePicture && (
         <img src={user.profilePicture} alt="Profile" style={avatarStyle} />
      )}

      {/* User Details */}
      <div style={userDetailsStyle}>
        <h2 style={displayNameStyle}>{user.displayName}</h2>
        <p style={emailStyle}>{user.email}</p>
      </div>

      {/* Placeholder for potential navigation links */}
      {/* <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginTop: '30px' }}> */}
      {/*   <a href="/home" style={{ color: '#ccc', textDecoration: 'none' }}>Home</a> */}
      {/*   <a href="/mood" style={{ color: '#ccc', textDecoration: 'none' }}>Guides</a> */}
      {/*   <a href="/journal" style={{ color: '#ccc', textDecoration: 'none' }}>Journal</a> */}
      {/* </nav> */}


      {/* Logout Button (pushed to bottom) */}
      {logout && (
         <button
           onClick={logout}
           className="logout-btn"
           style={logoutButtonStyle}
           onMouseEnter={(e) => {
               e.currentTarget.style.background = '#16a596';
               e.currentTarget.style.color = '#f5f5f5';
           }}
           onMouseLeave={(e) => {
               e.currentTarget.style.background = 'rgba(22, 165, 150, 0.2)';
               e.currentTarget.style.color = '#16a596';
           }}
         >
           Logout
         </button>
      )}
    </div>
  );
}