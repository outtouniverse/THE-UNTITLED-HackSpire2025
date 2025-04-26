// ChatCanvas.jsx
import React, { useState, useRef, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export default function ChatCanvas({ character, onClose }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    // Start a new chat when the canvas opens and character changes
    fetch(`${API_URL}/chat/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ character: character.name })
    })
      .then(res => res.json())
      .then(data => {
        setChatId(data.chatId);
        setMessages([]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error starting chat:', error);
        setLoading(false);
        // Optionally add an error message to state
         setMessages(msgs => [...msgs, { sender: 'system', text: 'Failed to start chat.', timestamp: new Date().toISOString(), isError: true }]);
      });
  }, [character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId || loading) return; // Prevent sending empty messages, while loading, or before chat starts

    const userMessage = { sender: 'user', text: input.trim(), timestamp: new Date().toISOString() };
    setMessages(msgs => [...msgs, userMessage]); // Add user message immediately
    setInput(''); // Clear input field

    try {
      // Optional: Add a temporary "..." or typing indicator message
      // const typingIndicatorId = Date.now(); // Unique ID for the typing message
      // setMessages(msgs => [...msgs, { sender: 'bot', text: '...', timestamp: new Date().toISOString(), id: typingIndicatorId, isTyping: true }]);


      const res = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ chatId, message: userMessage.text })
      });

      // Optional: Remove typing indicator before adding bot message
      // setMessages(msgs => msgs.filter(msg => !(msg.sender === 'bot' && msg.isTyping && msg.id === typingIndicatorId)));


      if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.bot, timestamp: new Date().toISOString() };
      setMessages(msgs => [...msgs, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add an error message to the chat
      setMessages(msgs => [...msgs, { sender: 'system', text: 'Error sending message. Please try again.', timestamp: new Date().toISOString(), isError: true }]);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };


  return (
    <div className="chat-canvas-bg">
      <div className="chat-canvas">
        <button className="close-btn" onClick={onClose} title="Close">×</button>

        <div className="chat-header">
          {character.img && (
              <img src={character.img} alt={character.name} className="character-img" />
          )}
          <div>
            <div className="character-name" style={{ color: character.color }}>{character.name}</div>
            <div className="character-desc">{character.desc}</div>
          </div>
        </div>

        <div className="chat-messages"> {/* This container remains */}
          {loading ? (
              <div>Loading chat...</div>
          ) : messages.length === 0 ? (
              <div>Say hello to {character.name}!</div>
          ) : (
            messages.map((msg, i) => (
              // Use the new class for each message item
              // The content is now directly inside this div, no separate bubble div needed for structure
              <div key={i} className={`chat-message-item ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                {msg.text} {/* Message text */}
                {/* Timestamp is now inside the item, aligned via flex/align-self */}
                <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-row">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Type your message...`} // Changed placeholder slightly
            onKeyPress={handleInputKeyPress}
            disabled={loading || !chatId} // Disable input while loading or chat not started
          />
          <button onClick={sendMessage} disabled={loading || !chatId || !input.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}