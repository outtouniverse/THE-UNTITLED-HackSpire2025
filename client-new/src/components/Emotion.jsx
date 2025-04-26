// Emotion.jsx
import React, { useState } from 'react';
import UserInfo from './UserInfo';
import Navbar from './Navbar';
import CharacterCards from './CharacterCards';
import ChatCanvas from './ChatCanvas';
import ChatHistory from './ChatHistory';
import ChatDetail from './ChatDetail';

export default function Emotion() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  const handleCloseChatCanvas = () => {
    setSelectedCharacter(null);
  };

  const handleSelectHistoryChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleBackToHistory = () => {
    setSelectedChatId(null);
  };

  let content;
  if (activeTab === 'chat') {
    content = selectedCharacter ? null : <CharacterCards onSelect={handleSelectCharacter} />;
  } else {
    content = selectedChatId ? (
      <ChatDetail chatId={selectedChatId} onBack={handleBackToHistory} />
    ) : 
      <ChatHistory onSelect={handleSelectHistoryChat} />;
  }

  return (
    <div className="app-container" style={{
      background: '#000',
      fontFamily: "'Inter', sans-serif",
      color: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      width: '100vw',
      padding: '0 16px',
    }}>
      <UserInfo />
      <div className="content-area" style={{
        maxWidth: 1100,
        width: '100%',
        margin: '0 auto',
        padding: '32px 0',
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
           {content}
        </div>
      </div>
      {selectedCharacter && (
        <ChatCanvas character={selectedCharacter} onClose={handleCloseChatCanvas} />
      )}
    </div>
  );
}