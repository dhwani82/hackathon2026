import { api, getApiErrorMessage } from './api';
import { tokenStorage } from '../storage/token';
import type { User, RegisterPayload, LoginPayload, ForgotPayload, ResetPayload, AuthLoginResponse } from '../types';

export const authService = {
  async register(payload: RegisterPayload): Promise<void> {
    await api.post('/auth/register', payload);
  },

  async login(payload: LoginPayload): Promise<AuthLoginResponse> {
    const { data } = await api.post<AuthLoginResponse>('/auth/login', payload);
    if (data.token) {
      await tokenStorage.set(data.token);
    }
    return data;
  },

  async forgot(payload: ForgotPayload): Promise<void> {
    await api.post('/auth/forgot', payload);
  },

  async reset(payload: ResetPayload): Promise<void> {
    await api.post('/auth/reset', payload);
  },

  async me(): Promise<User> {
    const { data } = await api.get<{ user: User }>('/me');
    return data.user;
  },

  async logout(): Promise<void> {
    await tokenStorage.remove();
  },
};

export { getApiErrorMessage };
