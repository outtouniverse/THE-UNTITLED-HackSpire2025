
import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="tabs" style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 32,
      position: 'relative',
      borderBottom: '1px solid rgba(71, 71, 135, 0.2)'
    }}>
      {['chat', 'history'].map(tab => (
        <span
          key={tab}
          className={`tab${activeTab === tab ? ' active' : ''}`}
          style={{
            padding: '10px 24px',
            fontWeight: 500,
            fontSize: '1.05rem',
            color: activeTab === tab ? '#f5f5f5' : '#b8b8b8',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
            position: 'relative',
          }}
          onClick={() => setActiveTab(tab)}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            if (activeTab !== tab) {
              e.currentTarget.style.color = '#b8b8b8';
            }
          }}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          {activeTab === tab && (
            <div
              className="tab-indicator"
              style={{
                position: 'absolute',
                bottom: -2,
                left: '50%',
                transform: 'translateX(-50%)',
                height: 3,
                width: '60%',
                backgroundColor: '#16a596',
                borderRadius: 999,
                transition: 'width 0.3s ease, left 0.3s ease, transform 0.3s ease',
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
