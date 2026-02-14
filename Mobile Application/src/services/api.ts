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
      message = `Connection timeout. Check that the backend is running at ${config.BASE_URL} and your device is on the same network.`;
    } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
      message = `Cannot reach server at ${config.BASE_URL}. Is the backend running? Same Wi‑Fi?`;
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
