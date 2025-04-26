// CharacterSelector.jsx file 

import React from 'react';
export default function CharacterSelector({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="Sadie">Sadie (Sadness)</option>
      <option value="Zest">Zest (Happiness)</option>
      <option value="Pace">Pace (Anxiety)</option>
      <option value="Blaze">Blaze (Anger)</option>
      <option value="Nova">Nova (Loneliness)</option>
    </select>
  );
} 