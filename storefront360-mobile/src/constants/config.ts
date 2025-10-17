export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';
export const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '10000');

export const APP_NAME = 'Storefront 360';
export const APP_VERSION = '1.0.0';

export const COLORS = {
  primary: '#2563EB',      // Blue (from mockups)
  secondary: '#1E3A8A',    // Dark Blue
  success: '#10B981',      // Green
  error: '#EF4444',        // Red
  warning: '#F59E0B',      // Yellow
  info: '#3B82F6',         // Blue
  background: '#F9FAFB',   // Light Gray
  surface: '#FFFFFF',      // White
  text: '#111827',         // Dark Gray
  textSecondary: '#6B7280', // Medium Gray
  border: '#E5E7EB',       // Light Border
  disabled: '#D1D5DB',     // Disabled Gray
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
