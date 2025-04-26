const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const moodController = require('../controllers/moodController');

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/home');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// Get current user
router.get('/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        displayName: req.user.displayName,
        email: req.user.email,
        profilePicture: req.user.profilePicture
      }
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// POST /mood
router.post('/mood', moodController.addMood);

// Example for passport local strategy
router.post('/login', passport.authenticate('local', {
  successRedirect: '/mood/select',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

module.exports = router; 