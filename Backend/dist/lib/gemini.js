"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = generateResponse;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
    genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
}
async function generateResponse(prompt) {
    if (!genAI) {
        throw new Error('GEMINI_API_KEY is not configured');
    }
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text ?? '';
}
