// ChatDetail.jsx
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

export default function ChatDetail({ chatId, onBack }) {
  const [chat, setChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!chatId) {
        setError("No chat ID provided.");
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/chat/history/${chatId}`, { credentials: 'include' })
      .then(res => {
         if (!res.ok) {
             throw new Error(`HTTP error! status: ${res.status}`);
         }
         return res.json();
      })
      .then(data => {
        setChat(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch chat detail:", err);
        setError("Failed to load chat detail.");
        setLoading(false);
      });
  }, [chatId]);

  if (loading) return <div>Loading chat detail...</div>;
  if (error) return <div style={{ color: '#e53935' }}>{error}</div>;
  if (!chat) return <div>Chat not found.</div>;

  return (
    <div className="chat-detail-container">
      <button onClick={onBack} className="back-button">
        ← Back to History
      </button>
      <h4 style={{ marginBottom: '15px', marginTop: '0' }}>Chat with {chat.character}</h4>
      <div className="detail-messages"> {/* This container remains */}
        {chat.messages && chat.messages.length > 0 ? (
            chat.messages.map((msg, i) => {
              // Check if msg.timestamp is a valid date string
              const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Unknown Time';
              return (
                // Use the new class for each detail message item
                // Content is directly inside this div
                <div key={i} className={`detail-message-item ${msg.sender}`}>
                   {msg.text} {/* Message text */}
                   {/* Timestamp is now inside the item */}
                   <span className="timestamp">{time}</span>
                </div>
              );
            })
        ) : (
            <div>No messages in this chat.</div>
        )}
      </div>
    </div>
  );
}