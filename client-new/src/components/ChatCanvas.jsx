// ChatCanvas.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001';

const guideColorMap = { // Example mapping, ensure it matches CharacterCard's
  Sadie: '#5c6ac4',    // Blueish
  Zest: '#ecc94b',    // Yellowish
  Pace: '#f59e0b',    // Orange
  Blaze: '#ed64a6',   // Pink/Reddish
  Nova: '#9f7aea',    // Purple
  // Add other characters if needed
};

export default function ChatCanvas({ character, onClose }) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [generatedTask, setGeneratedTask] = useState(null);
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [taskError, setTaskError] = useState(null);
  const [showTaskArea, setShowTaskArea] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setLoading(true);
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
      });
  }, [character]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !chatId) return;

    const userMessage = { sender: 'user', text: input.trim(), timestamp: new Date().toISOString() };
    setMessages(msgs => [...msgs, userMessage]);
    setInput('');

    try {
      const res = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ chatId, message: userMessage.text })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.bot, timestamp: new Date().toISOString() };
      setMessages(msgs => [...msgs, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(msgs => [...msgs, { sender: 'system', text: 'Error sending message.', timestamp: new Date().toISOString(), isError: true }]);
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const emotionColor = guideColorMap[character.name] || '#474787';

  const handleEndChatAndGetTask = async () => {
    setIsGeneratingTask(true);
    setTaskError(null);
    setGeneratedTask(null);

    try {
      const response = await axios.post(`${API_URL}/api/tasks/generate`,
        { chatId },
        { withCredentials: true }
      );

      if (response.data) {
        setGeneratedTask(response.data);
        setShowTaskArea(true);
      } else {
        setTaskError("Couldn't retrieve a task, but chat ended.");
      }

    } catch (err) {
      console.error("Error generating task:", err);
      setTaskError(err.response?.data?.message || "Failed to get task. Please try again later.");
      setShowTaskArea(true);
    } finally {
      setIsGeneratingTask(false);
    }
  };

  const handleCloseTaskView = () => {
    setShowTaskArea(false);
    setGeneratedTask(null);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="chat-canvas-bg" style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(18, 18, 18, 0.6)',
      backdropFilter: 'blur(5px)',
      WebkitBackdropFilter: 'blur(5px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="chat-canvas" style={{
        background: 'linear-gradient(160deg,rgb(20, 20, 24) 0%, #2C2C54 100%)',
        borderRadius: 24,
        border: '1px solid rgba(71, 71, 135, 0.3)',
        boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: 1024,
        minHeight: '70vh',
        maxHeight: '85vh',
        padding: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        color: '#f5f5f5',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}>

        <button
          onClick={showTaskArea ? handleCloseTaskView : onClose}
          title="Close (Esc)"
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#f5f5f5',
            width: 32,
            height: 32,
            borderRadius: '50%',
            fontSize: '1.5rem',
            lineHeight: '1',
            cursor: 'pointer',
            opacity: 0.8,
            transition: 'opacity 0.2s, background 0.2s, transform 0.2s',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = 1;
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = 0.8;
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          ×
        </button>

        <div className="chat-header" style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(71, 71, 135, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <img src={character.img} alt={character.name} style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `1px solid ${emotionColor}`,
          }} />
          <h2 style={{
            fontSize: '1.3rem',
            fontWeight: 600,
            margin: 0,
            fontFamily: "'Inter', serif",
            letterSpacing: '0.02em'
          }}>
            {character.name}
          </h2>
        </div>

        {!showTaskArea ? (
          <>
            <div className="message-list" style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}>
              {loading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontSize: '1.1rem',
                  color: '#a0a0a0'
                }}>
                  Loading messages...
                </div>
              ) : messages.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  color: '#a0a0a0',
                  marginTop: '2rem'
                }}>
                  Start your conversation with {character.name}!
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  const botBubbleColor = emotionColor;
                  return (
                    <div
                      key={index}
                      className={`message-item ${isUser ? 'user-message' : 'bot-message'}`}
                      style={{
                        display: 'flex',
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        gap: 8,
                        width: '100%',
                      }}
                    >
                      {!isUser && character.img && (
                        <img src={character.img} alt={character.name} style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: `1px solid ${emotionColor}`,
                          alignSelf: 'flex-end',
                        }} />
                      )}
                      <div style={{
                        background: isUser ? '#474787' : `linear-gradient(135deg, ${botBubbleColor}cc, ${botBubbleColor}aa)`,
                        color: '#f5f5f5',
                        borderRadius: isUser ? '18px 18px 0 18px' : '18px 18px 18px 0',
                        padding: '12px 18px',
                        maxWidth: '80%',
                        fontSize: '1rem',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.4,
                        boxShadow: isUser
                          ? '0 1px 4px rgba(71, 71, 135, 0.2)'
                          : '0 1px 4px rgba(0, 0, 0, 0.2)',
                        ...(msg.isError ? { backgroundColor: '#e53e3e', color: '#fff' } : {})
                      }}>
                        {msg.text}
                      </div>
                      <span style={{
                        fontSize: '0.85rem',
                        color: '#a0a0a0',
                        marginTop: 4,
                        whiteSpace: 'nowrap'
                      }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="input-area" style={{
              padding: '20px 24px',
              borderTop: `1px solid ${emotionColor}44`,
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              background: 'rgba(18, 18, 18, 0.2)',
            }} onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Message ${character.name}...`}
                style={{
                  flex: 1,
                  border: 'none',
                  borderRadius: 999,
                  background: 'rgba(18, 18, 18, 0.5)',
                  padding: '10px 18px',
                  fontSize: '1rem',
                  outline: 'none',
                  color: '#f5f5f5',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease',
                }}
                onKeyDown={handleInputKeyPress}
              />
              <button type="submit" disabled={loading || !chatId || !input.trim()}
                style={{
                  background: '#16a596',
                  color: '#f5f5f5',
                  border: 'none',
                  borderRadius: 999,
                  padding: '10px 20px',
                  fontWeight: 500,
                  fontSize: '1rem',
                  cursor: loading || !chatId || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: loading || !chatId || !input.trim() ? 0.5 : 1,
                  boxShadow: '0 0 10px rgba(22, 165, 150, 0.3)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (!(loading || !chatId || !input.trim())) {
                    e.currentTarget.style.transform = 'scale(1.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                Send
              </button>
              <button
                type="button"
                onClick={handleEndChatAndGetTask}
                disabled={isGeneratingTask}
                style={{ marginLeft: '10px', background: '#6c757d' }}
              >
                {isGeneratingTask ? 'Getting Task...' : 'End Chat & Get Task'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ padding: '30px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2>✨ Your Mood Booster Task ✨</h2>
            {isGeneratingTask && <p>Generating your task...</p>}
            {taskError && <p style={{ color: '#ff6b6b' }}>Error: {taskError}</p>}
            {generatedTask && (
              <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                <p style={{ fontSize: '1.2rem', lineHeight: 1.6, margin: 0 }}>
                  {generatedTask.text}
                </p>
              </div>
            )}
            <button onClick={handleCloseTaskView} style={{ marginTop: '30px', padding: '10px 20px', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}