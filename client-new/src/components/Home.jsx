// Home.jsx (This is the one used by App.jsx now)
import React from 'react';
import UserInfo from './UserInfo';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container"> {/* Using the new container class */}
      <h1 style={{ textAlign: 'center', color: 'var(--color-primary-dark)', marginBottom: '24px' }}>
        Welcome!
      </h1>
      <UserInfo /> {/* User info block */}

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link
          to="/mood"
          style={{
            display: 'inline-block',
            background: 'var(--color-primary)',
            color: '#fff',
            padding: '16px 36px',
            borderRadius: '10px',
            fontSize: '1.2rem',
            textDecoration: 'none',
            fontWeight: 600,
            boxShadow: 'var(--shadow-medium)',
            transition: 'background 0.2s, transform 0.1s',
          }}
          onMouseOver={(e) => e.target.style.background = 'var(--color-primary-dark)'} // Hover effect
          onMouseOut={(e) => e.target.style.background = 'var(--color-primary)'}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'} // Active effect
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          Select Your Emotional Guide
        </Link>
      </div>
    </div>
  );
}