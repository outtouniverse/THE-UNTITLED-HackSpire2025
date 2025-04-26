const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');

// Middleware to check authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

// Show mood selection page
router.get('/select', ensureAuthenticated, (req, res) => {
  res.sendFile(require('path').join(__dirname, '../views/mood.html'));
});

// Handle mood submission
router.post('/select', ensureAuthenticated, async (req, res) => {
  const { mood } = req.body;
  if (!['Happy', 'Sad', 'Neutral', 'Excited', 'Angry'].includes(mood)) {
    return res.status(400).send('Invalid mood');
  }
  await Mood.create({ user: req.user._id, mood });
  res.redirect('/home');
});

module.exports = router;