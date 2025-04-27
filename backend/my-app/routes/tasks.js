const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Chat = require('../models/Chat'); // Assuming your Chat model path
const { generateTaskForChat } = require('../services/taskService');
const { ensureAuthenticated } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// POST /api/tasks/generate - Generate and save a task for a completed chat
router.post('/generate', ensureAuthenticated, async (req, res) => {
    const { chatId } = req.body;
    const userId = req.user._id; // Get user from authenticated session

    if (!chatId) {
        return res.status(400).json({ message: 'Chat ID is required.' });
    }

    try {
        // 1. Find the chat to get context (user, character)
        const chat = await Chat.findOne({ _id: chatId, user: userId });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found or user mismatch.' });
        }

        // 2. Check if a task already exists for this chat (optional, prevents duplicates)
        const existingTask = await Task.findOne({ chat: chatId, user: userId });
        if (existingTask) {
            // Decide: return existing task or error? Let's return existing for simplicity.
            return res.status(200).json(existingTask);
            // Alternatively: return res.status(409).json({ message: 'Task already generated for this chat.' });
        }

        // 3. Generate task text using the service
        const taskText = generateTaskForChat(chat);

        // 4. Create and save the new task
        const newTask = new Task({
            text: taskText,
            user: userId,
            chat: chatId,
            character: chat.character, // Store character for context
        });

        await newTask.save();

        res.status(201).json(newTask);

    } catch (err) {
        console.error('Error generating task:', err);
        res.status(500).json({ message: 'Failed to generate task.' });
    }
});

// Optional: GET /api/tasks/chat/:chatId - Get task for a specific chat
router.get('/chat/:chatId', ensureAuthenticated, async (req, res) => {
    try {
        const task = await Task.findOne({ chat: req.params.chatId, user: req.user._id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found for this chat.' });
        }
        res.status(200).json(task);
    } catch (err) {
         console.error('Error fetching task:', err);
         res.status(500).json({ message: 'Failed to fetch task.' });
    }
});


module.exports = router; 