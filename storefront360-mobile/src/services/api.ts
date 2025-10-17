import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_URL, API_TIMEOUT } from '../constants/config';
import { getAuthToken, clearAuthData } from '../utils/storage';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - Clear auth and redirect to login
    if (error.response?.status === 401) {
      await clearAuthData();
      // Navigation will be handled by the auth store
    }

    // Handle network errors
    if (error.message === 'Network Error') {
      console.error('Network error - Please check your connection');
    }

    return Promise.reject(error);
  }
);

export default api;
