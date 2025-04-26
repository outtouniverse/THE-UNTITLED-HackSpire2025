// Emotion.jsx
import React, { useState } from 'react';
import UserInfo from './UserInfo';
import Navbar from './Navbar';
import CharacterCards from './CharacterCards';
// import ChatCanvas from './ChatCanvas'; // Remove old import
import VoiceChatInterface from './VoiceChatInterface'; // Import the new component
import ChatHistory from './ChatHistory';
import ChatDetail from './ChatDetail';

export default function Emotion() {
  // State to manage tabs: 'chat' or 'history'
  const [activeTab, setActiveTab] = useState('chat');
  // State for selected character to open voice chat canvas
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  // State for selected chat ID to view chat detail (for text history)
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Function to handle character selection - opens the voice chat interface
  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  // Function to close the voice chat interface
  const handleCloseChatInterface = () => {
    setSelectedCharacter(null);
  };

  // Function to select a chat from history (this will be text history)
  const handleSelectHistoryChat = (chatId) => {
    setSelectedChatId(chatId);
    // Optionally switch to history tab here if not already there
    // setActiveTab('history');
  };

  // Function to go back from chat detail to history list
  const handleBackToHistory = () => {
    setSelectedChatId(null);
  };

  // Determine content based on activeTab and states
  let content;
  if (activeTab === 'chat') {
    // When 'chat' tab is active, show CharacterCards
    content = <CharacterCards onSelect={handleSelectCharacter} />;
  } else { // activeTab === 'history'
    // When 'history' tab is active, show history list or detail
    content = selectedChatId ? (
      <ChatDetail chatId={selectedChatId} onBack={handleBackToHistory} />
    ) : (
      <ChatHistory onSelect={handleSelectHistoryChat} />
    );
  }

  return (
    <div className="app-container">
      <UserInfo />

      <div className="content-area"> {/* Area for tabs and dynamic content */}
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Render content based on tabs and selection */}
        {content}

        {/* Render VoiceChatInterface as an overlay if a character is selected */}
        {selectedCharacter && (
          <VoiceChatInterface
            character={selectedCharacter}
            onClose={handleCloseChatInterface}
          />
        )}
      </div>
    </div>
  );
}