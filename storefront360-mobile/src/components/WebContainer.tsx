import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_MOBILE_WIDTH = 480;

interface WebContainerProps {
  children: React.ReactNode;
}

export default function WebContainer({ children }: WebContainerProps) {
  // Only apply container on web
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  // If screen is mobile-sized, don't apply container
  if (SCREEN_WIDTH <= MAX_MOBILE_WIDTH) {
    return <>{children}</>;
  }

  // On web desktop, create a mobile-sized container
  return (
    <View style={styles.webWrapper}>
      <View style={styles.mobileContainer}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileContainer: {
    width: MAX_MOBILE_WIDTH,
    height: '100%',
    maxHeight: 844, // iPhone 14 Pro Max height
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    // @ts-ignore - web only
    boxShadow: Platform.OS === 'web' ? '0 0 40px rgba(0,0,0,0.15)' : undefined,
    overflow: 'hidden',
    borderRadius: Platform.OS === 'web' ? 16 : 0,
  },
});
