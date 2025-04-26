import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

export default function ChatDetail({ chatId, onBack }) {
  const [chat, setChat] = useState(null);
  useEffect(() => {
    fetch(`${API_URL}/chat/history/${chatId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(setChat);
  }, [chatId]);
  if (!chat) return <div>Loading...</div>;
  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 8, background: '#eee', color: '#1976d2' }}>Back to History</button>
      <h4 style={{ marginBottom: 8 }}>Chat Detail</h4>
      <div id="history-messages">
        {chat.messages.map((msg, i) => {
          const time = new Date(msg.timestamp).toLocaleString();
          return (
            <div key={i} className={msg.sender} style={{ marginBottom: 8 }}>
              <b>{msg.sender === 'user' ? 'You' : 'Bot'}:</b>
              <span> {msg.text} </span>
              <span className="timestamp" style={{ float: 'right' }}>{time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}