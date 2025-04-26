
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001';

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

  if (loading) return <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#a0a0a0'
  }}>Loading chat detail...</div>;
  if (error) return <div style={{ color: '#e53935' }}>{error}</div>;
  if (!chat) return <div>Chat not found.</div>;

  return (
    <div className="chat-detail-view" style={{
      background: 'linear-gradient(150deg, #2C2C54 0%, #1f1f2b 100%)',
      borderRadius: 24,
      boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
      padding: 0,
      maxWidth: '100%',
      width: 480,
      color: '#f5f5f5',
      position: 'relative',
      minHeight: '70vh',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <button onClick={onBack} style={{
        position: 'absolute',
        top: 10,
        left: 10,
        background: 'none',
        border: 'none',
        color: '#f5f5f5',
        fontSize: '1.5rem',
        cursor: 'pointer',
        opacity: 0.6,
        transition: 'opacity 0.2s',
      }}>
        ←
      </button>
      <h4 style={{
        padding: '20px 24px',
        margin: 0,
        borderBottom: '1px solid rgba(71, 71, 135, 0.3)',
        fontFamily: "'Inter', serif",
        fontSize: '1.4rem',
        fontWeight: 600
      }}>Chat with {chat.character}</h4>
      <div className="detail-messages" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {chat.messages && chat.messages.length > 0 ? (
          chat.messages.map((msg, i) => {
            const time = msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Unknown Time';
            const isUser = msg.sender === 'user';
            return (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                width: '100%'
              }}>
                <div style={{
                  background: isUser ? '#474787' : '#16a596',
                  color: '#f5f5f5',
                  borderRadius: isUser ? '18px 18px 0 18px' : '18px 18px 18px 0',
                  padding: '12px 18px',
                  fontSize: '1rem',
                  maxWidth: '80%',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.4,
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  {msg.text}
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  color: '#a0a0a0',
                  marginTop: 4,
                  whiteSpace: 'nowrap'
                }}>
                  {time}
                </span>
              </div>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            fontSize: '1.1rem',
            color: '#a0a0a0',
            marginTop: '2rem'
          }}>
            No messages in this chat.
          </div>
        )}
      </div>
    </div>
  );
}
