// utils/geminiClient.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBJCxG_0GduNhi45MTFXUiW_qnq7G4EOiY");

async function generateContent(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return text.trim();
    } catch (error) {
        console.error('Error calling Gemini:', error);
        throw new Error('Failed to generate content from Gemini.');
    }
}

module.exports = {
    generateContent
};
