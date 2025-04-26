import React from 'react';

export default function CharacterCard({ character, isHovered, onHoverChange, onClick }) {

  // Define colors within this component or import from shared utility
  const guideColorMap = {
    Fear:    { primary: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.5)' },
    Sadness: { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.5)' },
    Joy:     { primary: '#FBBF24', glow: 'rgba(251, 191, 36, 0.6)' }, // Joy might have stronger glow
    Disgust: { primary: '#10B981', glow: 'rgba(16, 185, 129, 0.5)' },
    Anger:   { primary: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' },
    default: { primary: '#A0A0A0', glow: 'rgba(160, 160, 160, 0.3)' }
  };

  const emotionColors = guideColorMap[character.name] || guideColorMap.default;

  // Determine if this character should have the Joy-like primary glow
  const showPrimaryGlow = character.name === 'Joy' || isHovered; // Example: Joy always glows, others glow on hover

  return (
    // Remove outer card div structure, return image container directly
    <div
      className="character-figure-container" // New class name
      style={{
        cursor: 'pointer',
        position: 'relative', // Needed for glow effect
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.3s ease',
        transform: isHovered ? 'scale(1.08) translateY(-10px)' : 'scale(1) translateY(0px)', // Scale up and lift on hover
      }}
      onMouseEnter={() => onHoverChange(character.id)} // Set hovered ID
      onMouseLeave={() => onHoverChange(null)}      // Clear hovered ID
      onClick={onClick}
    >
      {/* Character Image */}
      <img
        src={character.img}
        alt={character.name}
        className="character-figure-img" // New class name
        style={{
          height: '250px', // Adjust height as needed, maintain aspect ratio
          width: 'auto', // Auto width based on height
          objectFit: 'contain', // Ensure whole character is visible
          filter: isHovered ? `drop-shadow(0 8px 25px ${emotionColors.glow})` : 'none', // Glow effect using filter
          transition: 'filter 0.3s ease, transform 0.3s ease',
          zIndex: 1, // Image above glow div
        }}
      />

      {/* Optional: Separate Glow Div for more control (like Joy's) */}
      <div
        className="character-figure-glow" // New class name
        style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '50%', // Approximate glow shape
            background: showPrimaryGlow
              ? `radial-gradient(ellipse at center, ${emotionColors.glow} 10%, transparent 60%)`
              : 'transparent',
            opacity: showPrimaryGlow ? 1 : 0,
            transition: 'opacity 0.4s ease, background 0.4s ease',
            pointerEvents: 'none', // Don't interfere with clicks
            zIndex: 0, // Behind image
            transform: 'scale(1.3)', // Make glow larger than image
        }}
      />

      {/* Optional: Display Name on Hover */}
       <div style={{
           marginTop: '10px',
           color: emotionColors.primary,
           fontWeight: 600,
           fontSize: '1.1rem',
           opacity: isHovered ? 1 : 0,
           transition: 'opacity 0.3s ease',
           textShadow: '0 1px 3px rgba(0,0,0,0.5)' // Make text readable on dark bg
       }}>
           {character.name}
       </div>

      {/* Removed original card elements: background, name, desc, badge, tap hint */}
    </div>
  );
}