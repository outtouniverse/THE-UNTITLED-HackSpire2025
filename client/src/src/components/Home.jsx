// Home.jsx file 

import React, { useState } from 'react';
import Navbar from './Navbar';
import UserInfo from './UserInfo';
import ChatBox from './ChatBox';
import ChatHistory from './ChatHistory';
import ChatDetail from './ChatDetail';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedChatId, setSelectedChatId] = useState(null);

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>Welcome to Hackspire!</h1>
      <UserInfo />
      <Navbar activeTab={activeTab} setActiveTab={tab => { setActiveTab(tab); setSelectedChatId(null); }} />
      {activeTab === 'chat' && <ChatBox />}
      {activeTab === 'history' && !selectedChatId && <ChatHistory onSelect={setSelectedChatId} />}
      {activeTab === 'history' && selectedChatId && <ChatDetail chatId={selectedChatId} onBack={() => setSelectedChatId(null)} />}
    </div>
  );
} 
