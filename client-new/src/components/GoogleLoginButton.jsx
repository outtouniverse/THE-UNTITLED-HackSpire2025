// GoogleLoginButton.jsx
import React from 'react';

const BACKEND_URL = 'http://localhost:3001';

// Example placeholder icons (replace with actual SVGs or an icon library)
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"/></svg>;
const PencilIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.7,4.3c-0.4-0.4-1-0.4-1.4,0L17.5,7.1L14.9,4.5c-0.4-0.4-1-0.4-1.4,0L3.7,14.3c-0.1,0.1-0.2,0.3-0.2,0.5l-1,4c-0.1,0.4,0.2,0.8,0.6,0.8c0.1,0,0.2,0,0.2,0l4-1c0.2,0,0.4-0.1,0.5-0.2l10.8-10.8L21.7,4.3z M6.1,15.7L15.5,6.3l2.6,2.6l-9.4,9.4L6.1,15.7z M7.5,17.9l-2.6-2.6l0.7-0.7l2.6,2.6L7.5,17.9z M4.8,18.2L5.8,17l2.9,2.9l-1.2,1L4.8,18.2z"/></svg>;
const ArrowUpIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.7,2.7a1,1,0,0,0-1.4,0l-6,6a1,1,0,0,0,1.4,1.4L11,5.8V21a1,1,0,0,0,2,0V5.8l4.3,4.3a1,1,0,0,0,1.4-1.4l-6-6z"/></svg>;

export default function GoogleLoginButton() {

  const handleGoogleSignIn = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Shared styles for placeholder buttons/chips
  const chipStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#b8b8b8',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'not-allowed', // Indicate they are placeholders
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.2s',
  };

  return (
    // Main container mimicking the dashboard layout
    <div style={{
      display: 'flex',
      minHeight: '100vh', // Take full viewport height
      background: '#000', // Dark background matching screenshot
      color: '#f5f5f5',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* Placeholder Left Sidebar */}
     

      {/* Main Content Area */}
      <div style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center content horizontally
        justifyContent: 'center', // Center content vertically
        padding: '40px',
        position: 'relative', // For absolute positioning of elements like "Free plan"
      }}>

        {/* Placeholder Top "Free Plan" indicator */}
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '40px',
          background: '#333',
          padding: '5px 12px',
          borderRadius: '6px',
          fontSize: '0.85rem',
          color: '#ccc',
        }}>
          Free plan · <a href="#" style={{ color: '#a78bfa', textDecoration: 'none' }}>Upgrade</a>
        </div>

        {/* Placeholder Greeting */}
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 500,
          color: '#e0e0e0',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          fontFamily: "'Inter', serif", // Use the serif font for greeting
        }}>
          <span style={{ color: '#f59e0b', fontSize: '2.5rem' }}>✲</span> {/* Example decorative element */}
          Welcome! Please Sign In.
        </h1>

     <button
            onClick={handleGoogleSignIn}
            className="google-login-button"
            style={{
              display: 'inline-flex', // Use inline-flex to fit content
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#2a2a2a', // Subtle dark background consistent with theme
              color: '#e0e0e0',          // Light text for contrast
              border: '1px solid #555',  // Subtle border
              borderRadius: '8px',       // Standard rounded corners
              padding: '10px 24px',      // Balanced padding
              fontWeight: 500,           // Medium weight for clean look
              fontSize: '1rem',          // Standard font size
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, border-color 0.2s ease', // Smooth transition for hover
                       // Space above the button
              outline: 'none',           // Remove default browser outline
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#383838'; // Slightly lighter background on hover
              e.currentTarget.style.borderColor = '#777';     // Slightly brighter border on hover
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a'; // Revert background
              e.currentTarget.style.borderColor = '#555';     // Revert border
            }}
            // Add focus styles for accessibility, mirroring hover
            onFocus={(e) => {
              e.currentTarget.style.backgroundColor = '#383838';
              e.currentTarget.style.borderColor = '#777';
              // Optional: Add a subtle box-shadow for a focus ring if desired
              // e.currentTarget.style.boxShadow = '0 0 0 2px rgba(167, 139, 250, 0.4)'; // Example using a theme color
            }}
            onBlur={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.borderColor = '#555';
              // e.currentTarget.style.boxShadow = 'none'; // Remove focus ring on blur
            }}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" // Standard Google logo URL
              alt="Google"
              style={{
                  width: 20,
                  height: 20,
                  marginRight: 12,
                  // Keep white background for 'G' logo visibility and branding
                  background: '#fff',
                  borderRadius: '50%',
                  padding: '2px'
              }}
            />
            Sign in with Google
          </button>
         {/* The actual Google Login Button - positioned below the placeholder input */}
        


        {/* Placeholder Suggestion Chips */}
        <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px', maxWidth: '700px' }}>
          <button style={chipStyle}>Code</button>
          <button style={chipStyle}>Create</button>
          <button style={chipStyle}>Mentor's choice</button>
          <button style={chipStyle}>Write</button>
          <button style={chipStyle}>Learn</button>
          <button style={chipStyle}>Life stuff</button>
        </div>

        {/* Placeholder Bottom Left Avatar */}
      

      </div>
    </div>
  );
}