// CharacterCards.jsx
import React from 'react';
import CharacterCard from './CharacterCard';

const characters = [
  {
    name: 'Sadie',
    desc: 'Gentle guide for sadness',
    color: '#1976d2', // Original colors
    badge: '💧',
    img: '/assets/sadie.png'
  },
  {
    name: 'Zest',
    desc: 'Uplifting joy companion',
    color: '#43a047',
    badge: '🌟',
    img: '/assets/zest.png'
  },
  {
    name: 'Pace',
    desc: 'Calm for anxiety',
    color: '#fbc02d',
    badge: '🌙',
    img: '/assets/pace.png'
  },
  {
    name: 'Blaze',
    desc: 'Empowering anger guide',
    color: '#e53935',
    badge: '🔥',
    img: '/assets/blaze.png'
  },
  {
    name: 'Nova',
    desc: 'Soothing for loneliness',
    color: '#8e24aa',
    badge: '✨',
    img: '/assets/nova.png'
  }
];

export default function CharacterCards({ onSelect }) {
  return (
    <div className="character-selection-section"> {/* Optional: Wrapper for styling */}
      <div className="header">Choose Your Emotional Guide</div> {/* Use new header style */}
      <div className="character-row"> {/* New class */}
        {characters.map(char => (
          <CharacterCard key={char.name} character={char} onClick={() => onSelect(char)} />
        ))}
      </div>
    </div>
  );
}