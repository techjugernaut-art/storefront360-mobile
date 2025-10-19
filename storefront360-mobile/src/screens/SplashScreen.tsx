import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function SplashScreen({ onGetStarted, onLogin }: SplashScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Feature Tags */}
          <View style={styles.featuresContainer}>
            <View style={[styles.featureTag, styles.featureTopLeft]}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={styles.featureText}>Business Growth</Text>
            </View>
            <View style={[styles.featureTag, styles.featureMiddle]}>
              <Text style={styles.featureIcon}>📦</Text>
              <Text style={styles.featureText}>Inventory Tracking</Text>
            </View>
            <View style={[styles.featureTag, styles.featureBottomRight]}>
              <Text style={styles.featureIcon}>🛒</Text>
              <Text style={styles.featureText}>Product Addition</Text>
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>Welcome to Storefront</Text>
              <Text style={styles.description}>
                Take control of your business with an easy way to manage sales, track inventory, and add products. Storefront makes it simple to stay organized and grow your store.
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
                <Text style={styles.getStartedButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  featuresContainer: {
    flex: 1,
    position: 'relative',
  },
  featureTag: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.xs,
  },
  featureTopLeft: {
    top: 80,
    left: SPACING.lg,
  },
  featureMiddle: {
    top: 200,
    left: SPACING.lg,
  },
  featureBottomRight: {
    top: 340,
    right: SPACING.lg,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  content: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  textContainer: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  loginButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  loginButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  getStartedButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  getStartedButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
});
