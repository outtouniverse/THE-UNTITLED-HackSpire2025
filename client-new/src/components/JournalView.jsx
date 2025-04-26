import React, { useState, useEffect, useRef } from 'react';
import GratitudeCard from './GratitudeCard'; // Assuming GratitudeCard is styled for dark mode

// Optional: Import icons if needed (e.g., Feather Icons or SVGs)
// const FeatherIcon = ({ name, size = 20, color = 'currentColor' }) => { /* ... icon component ... */ };

const API_URL = 'http://localhost:3001'; // Your backend API base URL

export default function JournalView() {
  const [entries, setEntries] = useState([]);
  const [newEntryText, setNewEntryText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Fetch initial entries
  useEffect(() => {
    setLoading(true);
    // Simulate loading for demo purposes if needed: await new Promise(res => setTimeout(res, 1000));
    fetch(`${API_URL}/api/entries`, { credentials: 'include' }) // Assuming cookies/auth needed
      .then(res => {
        if (res.status === 401) throw new Error('Unauthorized. Please log in.');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => { setEntries(data); setError(null); })
      .catch(err => {
        console.error("Error fetching entries:", err);
        setError(err.message || "Failed to load entries.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Adjust textarea height dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height first
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [newEntryText]); // Re-run when text changes

  const handleChange = (event) => {
    setNewEntryText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedText = newEntryText.trim();
    if (!trimmedText || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include Authorization header if using token-based auth
          // 'Authorization': `Bearer ${your_token_here}`
        },
        body: JSON.stringify({ text: trimmedText }),
        credentials: 'include' // Send cookies if needed for session auth
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to get error details
        throw new Error(errorData.message || `Failed to add entry: ${response.statusText}`);
      }

      const addedEntry = await response.json();
      setEntries(prevEntries => [addedEntry, ...prevEntries]); // Add new entry to the top
      setNewEntryText(''); // Clear textarea
      // Reset height after clearing (handled by useEffect on newEntryText change)
    } catch (err) {
      console.error("Error adding entry:", err);
      setError(err.message || "Couldn't add entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Outer container using CSS class
    <div className="journal-view-outer-container">
      {/* Main Journal View Container using CSS class */}
      <div className="journal-view-container">

        {/* Header Area using CSS classes */}
        <header className="journal-view-header">
          <h1>My Gratitude Journal</h1>
          <span className="entry-count">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        </header>

        {/* Main Content Area using CSS class */}
        <div className="journal-view-content">

          {/* --- Form for New Entry using CSS classes --- */}
          <form onSubmit={handleSubmit} className="journal-form">
            <textarea
              ref={textareaRef}
              value={newEntryText}
              onChange={handleChange}
              placeholder="What positive moment brightened your day?"
              required
              rows={3} // Initial rows, height will adjust
              className="journal-textarea"
              // Inline style only for dynamic height adjustment
              style={{ height: 'auto' }}
            />
            <div className="journal-form-footer">
              {error && <p className="journal-error-message">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || !newEntryText.trim()}
                className="journal-submit-button"
              >
                {isSubmitting ? 'Adding...' : 'Add Gratitude'}
              </button>
            </div>
          </form>

          {/* --- List of Entries using CSS classes --- */}
          <div className="entries-list-scrollable">
            {loading ? (
              <div className="journal-loading">Loading reflections...</div>
            ) : entries.length === 0 && !error ? (
              <div className="journal-empty-state">
                Take a moment to appreciate the good things. <br /> Your first entry awaits. ✨
              </div>
            ) : (
              <div className="entries-list-container">
                {entries.map(entry => (
                  // Assuming GratitudeCard is styled via its own CSS or accepts classes
                  <GratitudeCard key={entry._id || entry.createdAt} entry={entry} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
