const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('./config/passport'); 
const config = require('./config/config');
const moodRoutes = require('./routes/mood');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongodb.uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS should be before routes
app.use(cors({
  origin: 'http://localhost:5173', // <-- allow your React dev server
  credentials: true
}));

// Session configuration
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API Routes
app.use('/auth', authRoutes);
app.use('/mood', moodRoutes);
app.use('/chat', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
