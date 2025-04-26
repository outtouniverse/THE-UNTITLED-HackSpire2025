
// ChatHistory.jsx
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

export default function ChatHistory({ onSelect }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) return <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#fff'
  }}>Loading chat history...</div>;
  if (error) return <div style={{ color: '#e53935' }}>{error}</div>;
  if (chats.length === 0) return (
    <div style={{
      textAlign: 'center',
      fontSize: '1.1rem',
      color: '#fff',
      marginTop: '2rem'
    }}>
      No chat history found. Start a new chat!
    </div>
  );

  return (
    <div className="chat-history-list" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: '24px 0'
    }}>
      {chats.map(chat => {
        const lastMessage = chat.messages && chat.messages.length > 0
          ? chat.messages[0].text.substring(0, 80) + (chat.messages[0].text.length > 80 ? '...' : '')
          : 'No messages in this chat.';
        return (
          <div
            key={chat._id}
            className="history-item"
            onClick={() => onSelect(chat._id)}
            role="button"
            tabIndex="0"
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(chat._id); }}
            style={{
              padding: '14px 18px',
              borderRadius: 12,
              
              cursor: 'pointer',
              transition: 'box-shadow 0.15s, border 0.15s',
              boxShadow: '0 1px 4px rgba(30,34,90,0.03)',
            }}
            onMouseOver={e => {
              e.currentTarget.style.border = '1.5px solid #222';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(30,34,90,0.08)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.border = '1.5px solid #f3f4f6';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(30,34,90,0.03)';
            }}
          >
            <h4 style={{
              margin: 0,
              fontFamily: "Inter",
              fontSize: '1.1rem',
              color: '#fff'
            }}>{chat.character}</h4>
            <p style={{
              margin: '6px 0 0 0',
              fontSize: '0.95rem',
              color: '#fff',
              lineHeight: 1.4
            }}>{lastMessage}</p>
            <span style={{
              fontSize: '0.8rem',
              color: '#fff',
              marginTop: 6
            }}>
              {new Date(chat.lastActivity).toLocaleDateString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}