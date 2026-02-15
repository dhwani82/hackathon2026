import { api, getApiErrorMessage } from './api';
import { tokenStorage } from '../storage/token';
import type { User, RegisterPayload, LoginPayload, ForgotPayload, ResetPayload, AuthLoginResponse } from '../types';

// Demo bypass: works even when backend is unreachable (e.g. connection timeout)
const DEMO_EMAIL = 'dhwani@gmail.com';
const DEMO_PASSWORD = 'dhwani08';
const DEMO_BYPASS_TOKEN = 'demo-bypass-token';
const DEMO_USER: User = { id: 'demo-user', name: 'Dhwani', email: DEMO_EMAIL };

function isDemoCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<void> {
    await api.post('/auth/register', payload);
  },

  async login(payload: LoginPayload): Promise<AuthLoginResponse> {
    const email = payload.email.trim().toLowerCase();
    const password = payload.password;

    if (isDemoCredentials(payload.email, password)) {
      try {
        const { data } = await api.post<AuthLoginResponse>('/auth/login', payload);
        if (data.token) await tokenStorage.set(data.token);
        return data;
      } catch {
        // Backend unreachable: log in locally so app still works
        await tokenStorage.set(DEMO_BYPASS_TOKEN);
        return { token: DEMO_BYPASS_TOKEN, user: DEMO_USER };
      }
    }

    const { data } = await api.post<AuthLoginResponse>('/auth/login', payload);
    if (data.token) await tokenStorage.set(data.token);
    return data;
  },

  async forgot(payload: ForgotPayload): Promise<void> {
    await api.post('/auth/forgot', payload);
  },

  async reset(payload: ResetPayload): Promise<void> {
    await api.post('/auth/reset', payload);
  },

  async me(): Promise<User> {
    const token = await tokenStorage.get();
    if (token === DEMO_BYPASS_TOKEN) return DEMO_USER;
    const { data } = await api.get<{ user: User }>('/me');
    return data.user;
  },

  async logout(): Promise<void> {
    await tokenStorage.remove();
  },
};

export { getApiErrorMessage };
