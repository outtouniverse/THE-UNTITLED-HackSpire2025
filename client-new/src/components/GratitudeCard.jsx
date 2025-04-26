import React from 'react';

// Optional: Feather icon example (requires installing 'react-feather')
// import { Feather } from 'react-feather';

const HeartIcon = () => ( // Simple heart icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ff7e5f', /* Coral accent */ marginRight: '10px', flexShrink: 0, marginTop: '2px' }}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

// Component to display a single gratitude entry
export default function GratitudeCard({ entry, theme }) { // Receive theme as a prop
  if (!entry) return null;

  // Use theme colors passed from parent, or fallback
  const cardTheme = theme || {
      textColor: '#4a4a4a',
      subtleTextColor: '#7a7a7a',
      borderColor: '#e0e0e0',
  };

  const formattedDate = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : '';

  return (
    <div
      className="gratitude-entry"
      style={{
        padding: '18px 0', // Vertical padding
        borderBottom: `1px solid ${cardTheme.borderColor}80`, // Lighter, semi-transparent divider
        marginBottom: '12px', // Space below entry
        color: cardTheme.textColor,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '8px' }}>
         <HeartIcon /> {/* Use a suitable icon */}
         <p style={{
            margin: 0,
            fontSize: '1rem',
            lineHeight: 1.65, // Slightly more line spacing
            fontWeight: 400,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            flexGrow: 1,
         }}>
           {entry.text}
         </p>
      </div>
      <p style={{
        margin: '0',
        textAlign: 'right',
        fontSize: '0.8rem',
        color: cardTheme.subtleTextColor,
        fontWeight: 300,
      }}>
        {formattedDate}
      </p>
    </div>
  );
}
