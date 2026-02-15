import { api, getApiErrorMessage } from './api';

// Gemini can be slow; use 90s so we don't timeout before the backend responds
const AI_REQUEST_TIMEOUT_MS = 90000;

export const aiService = {
  async askGemini(prompt: string): Promise<string> {
    const { data } = await api.post<{ response?: string; text?: string }>(
      '/ai/gemini',
      { prompt },
      { timeout: AI_REQUEST_TIMEOUT_MS }
    );
    return data.response ?? data.text ?? 'No response.';
  },
};

export { getApiErrorMessage };
