// CharacterCard.jsx
import React from 'react';

export default function CharacterCard({ character, onClick }) {
  return (
    <div
      className="character-card" // New class
      style={{ borderColor: character.color }} // Keep dynamic border color
      onClick={onClick}
    >
      <span className="character-badge" style={{ color: character.color }}>{character.badge}</span> {/* New class */}
      <img src={character.img} alt={character.name} className="character-img" /> {/* New class */}
      <div className="character-name" style={{ color: character.color }}>{character.name}</div> {/* New class, keep dynamic color */}
      <div className="character-desc">{character.desc}</div> {/* New class */}
    </div>
  );
}