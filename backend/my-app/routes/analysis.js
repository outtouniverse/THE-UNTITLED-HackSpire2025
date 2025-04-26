const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat'); // Adjust path if your Chat model is located elsewhere
const mongoose = require('mongoose');

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
  // Passport adds isAuthenticated() to the request object
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Please log in.' });
};

// GET /api/analysis/last7days - Analyze chats from the last 7 days for the logged-in user
router.get('/api/analysis/last7days', ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated session (Passport)

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find chats for the user within the last 7 days
    const chats = await Chat.find({
      user: userId,
      startedAt: { $gte: sevenDaysAgo } // Find chats started on or after 7 days ago
    })
    .select('character messages startedAt') // Select only needed fields
    .sort({ startedAt: -1 }); // Optional: sort by most recent

    if (!chats || chats.length === 0) {
      return res.json({
        message: "No chat activity found in the last 7 days.",
        analysis: {
          totalChats: 0,
          totalUserMessages: 0,
          characterFrequency: {},
          mostFrequentCharacter: null,
        }
      });
    }

    // --- Perform Analysis ---
    let totalUserMessages = 0;
    const characterCounts = {};

    chats.forEach(chat => {
      // Count user messages
      chat.messages.forEach(message => {
        if (message.sender === 'user') {
          totalUserMessages++;
        }
      });

      // Count character frequency
      if (chat.character) {
        characterCounts[chat.character] = (characterCounts[chat.character] || 0) + 1;
      }
    });

    // Find the most frequent character
    let mostFrequentCharacter = null;
    let maxCount = 0;
    for (const character in characterCounts) {
      if (characterCounts[character] > maxCount) {
        maxCount = characterCounts[character];
        mostFrequentCharacter = character;
      }
    }

    // --- Prepare Response ---
    const analysisResult = {
      periodStartDate: sevenDaysAgo.toISOString(),
      totalChats: chats.length,
      totalUserMessages: totalUserMessages,
      characterFrequency: characterCounts, // Shows how many chats per character
      mostFrequentCharacter: mostFrequentCharacter,
      // --- Potential Future Enhancements ---
      // sentimentAnalysis: "Requires NLP library (e.g., 'sentiment')",
      // commonThemes: "Requires keyword extraction",
    };

    res.json({
        message: "Chat analysis for the last 7 days.",
        analysis: analysisResult
    });

  } catch (err) {
    console.error('Error performing chat analysis:', err);
    res.status(500).json({ message: 'Error analyzing chat data.' });
  }
});

module.exports = router;
