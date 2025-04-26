import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000';

export default function ChatHistory({ onSelect }) {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/chat/history`, { credentials: 'include' })
      .then(res => res.json())
      .then(setChats);
  }, []);
  return (
    <div>
      <h3 style={{ marginBottom: 8 }}>Your Chat History</h3>
      <div className="history-list">
        {chats.map(chat => {
          const started = new Date(chat.startedAt).toLocaleString();
          const preview = chat.messages && chat.messages.length > 0 ? chat.messages[0].text.slice(0, 40) + (chat.messages[0].text.length > 40 ? '...' : '') : '';
          return (
            <div
              key={chat._id}
              className="history-item"
              onClick={() => onSelect(chat._id)}
            >
              <b>{chat.character}</b> <span className="timestamp">{started}</span>
              <div style={{ color: '#888' }}>{preview}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}