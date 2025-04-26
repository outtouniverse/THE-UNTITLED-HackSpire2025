import React, { useState } from 'react';
import CharacterCard from './CharacterCard';

const characters = [
  {
    id: 'sadie',
    name: 'Sadie',
    desc: 'Gentle guide for sadness',
    color: '#3B82F6',
    img: '/assets/sad2.png'
  },
  {
    id: 'zest',
    name: 'Zest',
    desc: 'Uplifting joy companion',
    color: '#FBBF24',
    img: '/assets/happy2.png'
  },
  {
    id: 'pace',
    name: 'Pace',
    desc: 'Calm for anxiety',
    color: '#c4b5fd', // Consider mapping this to an emotion name if CharacterCard uses it
    img: '/assets/confused2.png' // Assuming Pace relates to Fear/Anxiety
  },
  {
    id: 'blaze',
    name: 'Blaze',
    desc: 'Empowering anger guide',
    color: '#EF4444',
    img: '/assets/angry2.png' // Assuming Blaze relates to Anger
  },
  {
    id: 'nova',
    name: 'Nova',
    desc: 'Soothing for loneliness',
    color: '#a78bfa', // Consider mapping this to an emotion name if CharacterCard uses it
    img: '/assets/alone2.png' // Assuming Nova relates to Sadness or a unique emotion
  }
  // Note: The CharacterCard component uses specific names ('Fear', 'Sadness', 'Joy', 'Disgust', 'Anger')
  // to determine colors. Ensure the character objects passed match these names or update CharacterCard logic.
  // For now, we'll use the names provided here ('Sadie', 'Zest', etc.) for display.
];

export default function CharacterCards({ onSelect }) {
  const [hoveredCharacterId, setHoveredCharacterId] = useState(null);

  return (
    <div className="character-selection-stage" style={{
      margin: '60px auto 20px auto',
      maxWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end', // Aligns the bottom of the wrapper divs
      gap: '40px', // Spacing between character wrappers
      padding: '20px 0',
      minHeight: '350px', // Ensure enough height for card + hover effect
      position: 'relative',
    }}>
      {characters.map((char) => (
        // Wrapper div for each character card
        <div
          key={char.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <CharacterCard
            // Pass a character object that CharacterCard understands for colors,
            // potentially mapping names like 'Sadie' to 'Sadness' if needed there.
            // For now, passing the existing char object.
            character={char}
            isHovered={hoveredCharacterId === char.id}
            onHoverChange={setHoveredCharacterId}
            onClick={() => onSelect(char)}
          />
          {/* Character Name Removed */}
        </div>
      ))}
    </div>
  );
}