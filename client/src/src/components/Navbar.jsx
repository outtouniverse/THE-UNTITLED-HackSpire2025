// Navbar.jsx file 
import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <span
        className={`tab${activeTab === 'chat' ? ' active' : ''}`}
        onClick={() => setActiveTab('chat')}
      >
        Chat
      </span>
      <span
        className={`tab${activeTab === 'history' ? ' active' : ''}`}
        onClick={() => setActiveTab('history')}
      >
        History
      </span>
    </div>
  );
}