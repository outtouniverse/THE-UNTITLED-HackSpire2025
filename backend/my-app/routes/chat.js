const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const { getBotResponse } = require('../services/characterBot');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const Mood = require('../models/Mood');

// Start a new chat session
router.post('/start', ensureAuthenticated, async (req, res) => {
  const { character } = req.body;

  // Save the selected character as a mood
  await Mood.create({
    user: req.user._id,
    mood: character, // Save the character name as mood
    date: new Date()
  });

  const chat = await Chat.create({
    user: req.user._id,
    character,
    messages: []
  });
  res.json({ chatId: chat._id });
});

// Send a message in a chat session
router.post('/message', ensureAuthenticated, async (req, res) => {
  const { chatId, message } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(404).send('Chat not found');

  // Save user message
  chat.messages.push({ sender: 'user', text: message });
  await chat.save();

  // Get bot response
  const botResponse = await getBotResponse(chat.character, chat.messages);

  // Save bot message
  chat.messages.push({ sender: 'bot', text: botResponse });
  await chat.save();

  res.json({ bot: botResponse });
});

// 1. Get all chat histories for the user
router.get('/history', ensureAuthenticated, async (req, res) => {
  const chats = await Chat.find({ user: req.user._id }).sort({ startedAt: -1 });
  res.json(chats);
});

// 2. Get a specific chat by ID
router.get('/history/:chatId', ensureAuthenticated, async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });
  if (!chat) return res.status(404).send('Chat not found');
  res.json(chat);
});

module.exports = router;
