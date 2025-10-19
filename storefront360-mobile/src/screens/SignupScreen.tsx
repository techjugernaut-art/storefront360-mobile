import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS, SIZES, SPACING } from '../constants/config';

interface SignupScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

const COUNTRY_CODES = [
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
];

export default function SignupScreen({ onComplete, onCancel }: SignupScreenProps) {
  const { register } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Personal Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+233');
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  // Step 2: PIN
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  // Step 3: OTP Verification
  const [otp, setOtp] = useState(['', '', '', '']);

  // Step 4: Store Setup
  const [storeName, setStoreName] = useState('');
  const [storeCategory, setStoreCategory] = useState('');
  const [storeLocation, setStoreLocation] = useState('');

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleaned);
  };

  const handlePinChange = (text: string, field: 'pin' | 'confirmPin') => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4);
    if (field === 'pin') {
      setPin(cleaned);
    } else {
      setConfirmPin(cleaned);
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = cleaned;
      setOtp(newOtp);
    }
  };

  const validateStep1 = () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return false;
    }
    if (!phoneNumber.trim() || phoneNumber.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (pin.length !== 4) {
      Alert.alert('Error', 'PIN must be exactly 4 digits');
      return false;
    }
    if (confirmPin.length !== 4) {
      Alert.alert('Error', 'Please confirm your PIN');
      return false;
    }
    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (otp.some((digit) => !digit)) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!storeName.trim()) {
      Alert.alert('Error', 'Please enter your store name');
      return false;
    }
    if (!storeCategory.trim()) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!storeLocation.trim()) {
      Alert.alert('Error', 'Please enter your store location');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      // Send OTP
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1000);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    } else if (step === 4 && validateStep4()) {
      setStep(5); // Move to product addition or completion
    } else if (step === 5) {
      // Complete signup
      await handleCompleteSignup();
    }
  };

  const handleCompleteSignup = async () => {
    setIsLoading(true);
    try {
      // Call the registration API through the auth store
      await register({
        phoneNumber,
        countryCode,
        fullName: `${firstName} ${lastName}`,
        pin,
        confirmPin,
        role: 'merchant',
      });

      // Registration successful, user is now authenticated
      onComplete();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onCancel();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Tell us about yourself</Text>
      <Text style={styles.stepSubtitle}>Kindly enter your full name and number</Text>

      <View style={styles.form}>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={firstName}
          onChangeText={setFirstName}
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={[styles.label, { marginTop: SPACING.lg }]}>Last name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={lastName}
          onChangeText={setLastName}
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={[styles.label, { marginTop: SPACING.lg }]}>Phone number</Text>
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
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={15}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

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
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Set a PIN</Text>
      <Text style={styles.stepSubtitle}>Enter a 4-digit PIN to secure your account</Text>

      <View style={styles.form}>
        <Text style={styles.label}>PIN</Text>
        <View style={styles.pinInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter 4-digit PIN"
            value={pin}
            onChangeText={(text) => handlePinChange(text, 'pin')}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry={!showPin}
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPin(!showPin)}
          >
            <Text style={styles.eyeIconText}>{showPin ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.label, { marginTop: SPACING.lg }]}>Confirm PIN</Text>
        <View style={styles.pinInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Re-enter 4-digit PIN"
            value={confirmPin}
            onChangeText={(text) => handlePinChange(text, 'confirmPin')}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry={!showConfirmPin}
            placeholderTextColor={COLORS.textSecondary}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPin(!showConfirmPin)}
          >
            <Text style={styles.eyeIconText}>{showConfirmPin ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Verify your phone number</Text>
      <Text style={styles.stepSubtitle}>
        Enter the OTP sent to {countryCode} {phoneNumber}
      </Text>

      <View style={styles.form}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.resendButton}>
          <Text style={styles.resendText}>Resend verification code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>
        Let's set up your store, {firstName}!
      </Text>

      <View style={styles.form}>
        <TouchableOpacity style={styles.imageUpload}>
          <Text style={styles.imageUploadIcon}>📷</Text>
          <Text style={styles.imageUploadText}>Store Image</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Store name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter store name"
          value={storeName}
          onChangeText={setStoreName}
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={[styles.label, { marginTop: SPACING.lg }]}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Select category"
          value={storeCategory}
          onChangeText={setStoreCategory}
          placeholderTextColor={COLORS.textSecondary}
        />

        <Text style={[styles.label, { marginTop: SPACING.lg }]}>Store Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={storeLocation}
          onChangeText={setStoreLocation}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>All set!</Text>
      <Text style={styles.stepSubtitle}>
        You can now start managing your store. You can add products later from the dashboard.
      </Text>

      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Account Created Successfully!</Text>
        <Text style={styles.successText}>
          Welcome to Storefront 360. Your store is ready to go.
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4, 5].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.continueButton, isLoading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>
                {step === 5 ? 'Get Started' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: SIZES.xxl,
    color: COLORS.text,
  },
  cancelText: {
    fontSize: SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  progressDot: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  progressDotActive: {
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
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
  countryPicker: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
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
  pinInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
  },
  eyeIconText: {
    fontSize: SIZES.lg,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
    marginVertical: SPACING.xl,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  resendText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  imageUpload: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  imageUploadIcon: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  imageUploadText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${COLORS.success}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  successIconText: {
    fontSize: 50,
    color: COLORS.success,
  },
  successTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  successText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  buttonContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.lg,
    fontWeight: 'bold',
  },
});
