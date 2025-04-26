// ChatHistory.jsx
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000'; // Make sure this is correct

export default function ChatHistory({ onSelect }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/chat/history`, { credentials: 'include' })
      .then(res => {
         if (!res.ok) {
             throw new Error(`HTTP error! status: ${res.status}`);
         }
         return res.json();
      })
      .then(data => {
        setChats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch chat history:", err);
        setError("Failed to load chat history.");
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once on mount

  if (loading) return <div>Loading chat history...</div>;
  if (error) return <div style={{ color: '#e53935' }}>{error}</div>; // Show error message
  if (chats.length === 0) return <div>No chat history found. Start a new chat!</div>; // Message for empty history

  return (
    <div className="chat-history-section"> {/* Optional: Wrapper for styling */}
      <h3>Your Chat History</h3> {/* Use new heading style */}
      <div className="history-list"> {/* New class */}
        {chats.map(chat => {
          // Check if chat.startedAt is a valid date string before creating Date object
          const started = chat.startedAt ? new Date(chat.startedAt).toLocaleString() : 'Unknown Date';
          // Safely access the first message text
          const preview = chat.messages && chat.messages.length > 0 && chat.messages[0].text
            ? chat.messages[0].text.slice(0, 60) + (chat.messages[0].text.length > 60 ? '...' : '') // Increased preview length
            : 'No messages in this chat.';
          return (
            <div
              key={chat._id}
              className="history-item" // New class
              onClick={() => onSelect(chat._id)}
              role="button" // Indicate it's clickable
              tabIndex="0" // Make it focusable
              onKeyPress={(e) => { if(e.key === 'Enter' || e.key === ' ') onSelect(chat._id); }} // Allow keyboard selection
            >
              <strong>{chat.character}</strong> <span className="timestamp">{started}</span> {/* New classes */}
              <div className="preview">{preview}</div> {/* New class */}
            </div>
          );
        })}
      </div>
    </div>
  );
}