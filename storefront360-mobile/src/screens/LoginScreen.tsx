import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS, SIZES, SPACING } from '../constants/config';

const COUNTRY_CODES = [
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
];

interface LoginScreenProps {
  onSignUp?: () => void;
}

export default function LoginScreen({ onSignUp }: LoginScreenProps) {
  const { login, isLoading, error } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+233');
  const [pin, setPin] = useState('');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (phoneNumber.length < 9) {
      Alert.alert('Error', 'Phone number must be at least 9 digits');
      return;
    }

    if (pin.length !== 6) {
      Alert.alert('Error', 'PIN must be exactly 6 digits');
      return;
    }

    try {
      await login(phoneNumber, countryCode, pin);
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid phone number or PIN'
      );
    }
  };

  const handlePinChange = (text: string) => {
    // Only allow numbers and max 6 digits
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(cleaned);
  };

  const handlePhoneChange = (text: string) => {
    // Only allow numbers
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleaned);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>S360</Text>
            </View>
            <Text style={styles.title}>Storefront 360</Text>
            <Text style={styles.subtitle}>Point of Sale System</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Phone Number</Text>

            {/* Country Code & Phone Input */}
            <View style={styles.phoneContainer}>
              <TouchableOpacity
                style={styles.countryCodeButton}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
              >
                <Text style={styles.countryFlag}>
                  {COUNTRY_CODES.find((c) => c.code === countryCode)?.flag || '🌍'}
                </Text>
                <Text style={styles.countryCode}>{countryCode}</Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.phoneInput}
                placeholder="244123456"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                keyboardType="phone-pad"
                maxLength={15}
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            {/* Country Picker */}
            {showCountryPicker && (
              <View style={styles.countryPicker}>
                {COUNTRY_CODES.map((item) => (
                  <TouchableOpacity
                    key={item.code}
                    style={styles.countryItem}
                    onPress={() => {
                      setCountryCode(item.code);
                      setShowCountryPicker(false);
                    }}
                  >
                    <Text style={styles.countryFlag}>{item.flag}</Text>
                    <Text style={styles.countryName}>{item.country}</Text>
                    <Text style={styles.countryCodeText}>{item.code}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* PIN Input */}
            <Text style={[styles.label, { marginTop: SPACING.lg }]}>PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChangeText={handlePinChange}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              placeholderTextColor={COLORS.textSecondary}
            />

            {/* Pin dots indicator */}
            <View style={styles.pinDots}>
              {[...Array(6)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.pinDot,
                    index < pin.length && styles.pinDotFilled,
                  ]}
                />
              ))}
            </View>

            {/* Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Forgot PIN */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot PIN?</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            {onSignUp && (
              <View style={styles.signupContainer}>
                <Text style={styles.signupPrompt}>Don't have an account? </Text>
                <TouchableOpacity onPress={onSignUp}>
                  <Text style={styles.signupLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Demo Credentials Helper */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Credentials:</Text>
            <Text style={styles.demoText}>Phone: 244123456</Text>
            <Text style={styles.demoText}>PIN: 123456</Text>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Powered by KudiGo • v1.0.0
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  countryFlag: {
    fontSize: SIZES.lg,
  },
  countryCode: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  dropdownArrow: {
    fontSize: 8,
    color: COLORS.textSecondary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  pinDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  pinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  pinDotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  countryPicker: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  countryName: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  countryCodeText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: SIZES.sm,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    marginTop: SPACING.xl,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: SIZES.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  signupPrompt: {
    color: COLORS.textSecondary,
    fontSize: SIZES.md,
  },
  signupLink: {
    color: COLORS.primary,
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  demoTitle: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: SPACING.xs,
  },
  demoText: {
    fontSize: SIZES.sm,
    color: '#92400E',
  },
  footer: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: SIZES.sm,
  },
});
