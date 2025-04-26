const axios = require('axios');

// Call the Python ML service for a bot response
async function getBotResponse(character, messages) {
  try {
    const response = await axios.post('http://localhost:5000/chat', {
      character,
      messages
    });
    return response.data.reply;
  } catch (err) {
    console.error('Error calling ML service:', err);
    return "Sorry, I'm having trouble responding right now.";
  }
}

module.exports = { getBotResponse };
