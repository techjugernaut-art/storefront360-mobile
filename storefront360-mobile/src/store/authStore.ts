import { create } from 'zustand';
import { authService, User, RegisterRequest } from '../services/auth.service';
import {
  saveAuthToken,
  saveRefreshToken,
  saveUser,
  clearAuthData,
  getAuthToken,
  getUser,
} from '../utils/storage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (phoneNumber: string, countryCode: string, pin: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Login user
   */
  login: async (phoneNumber: string, countryCode: string, pin: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login({
        phoneNumber,
        countryCode,
        pin,
      });

      // Save to async storage
      await saveAuthToken(response.token);
      await saveRefreshToken(response.refreshToken);
      await saveUser(response.user);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Login failed. Please try again.';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);

      // Save to async storage
      await saveAuthToken(response.token);
      await saveRefreshToken(response.refreshToken);
      await saveUser(response.user);

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please try again.';
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await clearAuthData();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Load user from storage on app start
   */
  loadUser: async () => {
    set({ isLoading: true });
    try {
      const token = await getAuthToken();
      const user = await getUser();

      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Clear error
   */
  clearError: () => {
    set({ error: null });
  },
}));
