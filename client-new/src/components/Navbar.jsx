// Navbar.jsx
import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <div className="tabs"> {/* New class for the tab container */}
      <span
        className={`tab${activeTab === 'chat' ? ' active' : ''}`} // New classes
        onClick={() => setActiveTab('chat')}
      >
        Chat
      </span>
      <span
        className={`tab${activeTab === 'history' ? ' active' : ''}`} // New classes
        onClick={() => setActiveTab('history')}
      >
        History
      </span>
    </div>
  );
}