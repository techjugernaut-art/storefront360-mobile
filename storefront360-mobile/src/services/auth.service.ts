import api from './api';

export interface LoginRequest {
  phoneNumber: string;
  countryCode: string;
  pin: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  countryCode: string;
  fullName: string;
  email?: string;
  pin: string;
  confirmPin: string;
  role?: string;
}

export interface User {
  id: string;
  phoneNumber: string;
  countryCode: string;
  fullName: string;
  email?: string;
  role: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const authService = {
  /**
   * Login with phone number and PIN
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ status: string; data: AuthResponse }>(
      '/api/auth/login',
      data
    );
    return response.data.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<{ status: string; data: AuthResponse }>(
      '/api/auth/register',
      data
    );
    return response.data.data;
  },

  /**
   * Get current user
   */
  me: async (): Promise<User> => {
    const response = await api.get<{ status: string; data: { user: User } }>(
      '/api/auth/me'
    );
    return response.data.data.user;
  },

  /**
   * Change PIN
   */
  changePin: async (data: {
    currentPin: string;
    newPin: string;
    confirmNewPin: string;
  }): Promise<{ message: string }> => {
    const response = await api.put<{
      status: string;
      data: { message: string };
    }>('/api/auth/change-pin', data);
    return response.data.data;
  },

  /**
   * Logout
   */
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await api.post<{
      status: string;
      data: { token: string };
    }>('/api/auth/refresh-token', { refreshToken });
    return response.data.data;
  },
};
