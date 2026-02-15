export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthLoginResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPayload {
  email: string;
}

export interface ResetPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ApiError {
  message?: string;
  error?: string;
  status?: number;
}
