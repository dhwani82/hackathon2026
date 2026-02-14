import { api, getApiErrorMessage } from './api';

export const aiService = {
  async askGemini(prompt: string): Promise<string> {
    const { data } = await api.post<{ response?: string; text?: string }>('/ai/gemini', { prompt });
    return data.response ?? data.text ?? 'No response.';
  },
};

export { getApiErrorMessage };
