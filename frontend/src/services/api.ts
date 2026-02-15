import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { tokenStorage } from '../storage/token';

export const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (req) => {
    const token = await tokenStorage.get();
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<{ message?: string; error?: string }>) => {
    let message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'Something went wrong. Please try again.';
    if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
      const isAiRequest = err.config?.url?.includes('/ai/') || err.config?.url?.includes('/gemini');
      message = isAiRequest
        ? 'The AI is taking too long to respond. Try again or use a shorter message.'
        : `Connection timeout. Check that the backend is running at ${config.BASE_URL} and your device is on the same network.`;
    } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      message = `Can't connect to server (${config.BASE_URL}). 1) Backend running? 2) Phone on same Wi‑Fi as PC? 3) In app folder run .\\set-api-url.ps1 then restart Expo.`;
    }
    return Promise.reject({ ...err, userMessage: message });
  }
);

export function getApiErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'userMessage' in err && typeof (err as { userMessage: string }).userMessage === 'string') {
    return (err as { userMessage: string }).userMessage;
  }
  if (err instanceof Error) return err.message;
  return 'Something went wrong. Please try again.';
}
