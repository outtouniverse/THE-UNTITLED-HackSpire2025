const express = require('express');
const router = express.Router();
const GratitudeEntry = require('../models/GratitudeEntry'); // Adjust path as needed

// Get all entries
router.get('/api/entries', async (req, res) => {
  try {
    const entries = await GratitudeEntry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add new entry
router.post('/api/entries', async (req, res) => {
  const entry = new GratitudeEntry({
    text: req.body.text,
  });

  try {
    const newEntry = await entry.save();
    // Emit to all connected clients if io is available
    const io = req.app.get('io');
    if (io) {
      io.emit('newEntry', newEntry);
    }
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error saving entry:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
