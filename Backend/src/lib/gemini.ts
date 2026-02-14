import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function generateResponse(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is not configured');
  }
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text ?? '';
}
