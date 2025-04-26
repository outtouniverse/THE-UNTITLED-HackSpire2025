// ChatBox.jsx file 

import React, { useState } from 'react';
import CharacterSelector from './CharacterSelector';

const API_URL = 'http://localhost:3000';

export default function ChatBox() {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [character, setCharacter] = useState('Sadie');

  const startChat = async () => {
    const res = await fetch(`${API_URL}/chat/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ character })
    });
    const data = await res.json();
    setChatId(data.chatId);
    setMessages([]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API_URL}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ chatId, message: input })
    });
    const data = await res.json();
    setMessages(msgs => [...msgs, { sender: 'user', text: input }, { sender: 'bot', text: data.bot }]);
    setInput('');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>How are you feeling today?</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <CharacterSelector value={character} onChange={setCharacter} />
        <button onClick={startChat}>Start Chat</button>
      </div>
      <div id="chat-section" style={{ display: chatId ? 'block' : 'none' }}>
        <div id="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={msg.sender}>
              <b>{msg.sender === 'user' ? 'You' : 'Bot'}:</b> {msg.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flex: 1 }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
} 