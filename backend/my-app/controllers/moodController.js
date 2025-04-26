const User = require('../models/User');

exports.addMood = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const { mood } = req.body;
  if (!mood) {
    return res.status(400).json({ message: 'Mood is required' });
  }
  try {
    req.user.moodHistory = req.user.moodHistory || [];
    req.user.moodHistory.push({ mood });
    await req.user.save();
    res.json({ message: 'Mood saved' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving mood' });
  }
};