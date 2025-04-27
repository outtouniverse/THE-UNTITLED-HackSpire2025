const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
    index: true,
  },
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat', // Reference to your Chat model
    required: true,
    index: true,
  },
  character: {
    type: String,
    required: false, // Character name for context
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  }
});

// Optional: Ensure a user can only have one task per chat session
// taskSchema.index({ user: 1, chat: 1 }, { unique: true });

module.exports = mongoose.model('Task', taskSchema); 