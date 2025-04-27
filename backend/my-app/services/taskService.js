// services/taskService.js
const { generateContent } = require('../utils/geminiClient'); // Assume you have a Gemini API wrapper

async function generateTaskForChat(chat) {
    const chatMessages = chat.messages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');

    const prompt = `
You are an AI assistant that helps users uplift their mood.
Based on the following conversation between a user and a virtual character, suggest one small positive action the user can take right now to feel better.

The task should be:
- Simple and achievable
- Encouraging and positive
- Written in a friendly tone

Here is the chat:
${chatMessages}

Now, suggest the task (only the task, no explanation):
`;

    const response = await generateContent(prompt);

    return response;
}

module.exports = {
    generateTaskForChat
};
