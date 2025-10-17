import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: '@storefront360:auth_token',
  REFRESH_TOKEN: '@storefront360:refresh_token',
  USER: '@storefront360:user',
};

/**
 * Save auth token
 */
export const saveAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error saving auth token:', error);
    throw error;
  }
};

/**
 * Get auth token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Save refresh token
 */
export const saveRefreshToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.REFRESH_TOKEN, token);
  } catch (error) {
    console.error('Error saving refresh token:', error);
    throw error;
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Save user data
 */
export const saveUser = async (user: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

/**
 * Get user data
 */
export const getUser = async (): Promise<any | null> => {
  try {
    const userData = await AsyncStorage.getItem(KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Clear all auth data
 */
export const clearAuthData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.AUTH_TOKEN,
      KEYS.REFRESH_TOKEN,
      KEYS.USER,
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    return false;
  }
};
