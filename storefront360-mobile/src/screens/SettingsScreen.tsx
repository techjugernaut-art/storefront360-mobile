import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS, SIZES, SPACING } from '../constants/config';

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      id: 1,
      title: 'Personal Profile',
      icon: '👤',
      onPress: () => console.log('Personal Profile'),
    },
    {
      id: 2,
      title: 'Shop',
      icon: '🏪',
      onPress: () => console.log('Shop'),
    },
    {
      id: 3,
      title: 'Change PIN',
      icon: '🔒',
      onPress: () => console.log('Change PIN'),
    },
    {
      id: 4,
      title: 'Notifications',
      icon: '🔔',
      onPress: () => console.log('Notifications'),
    },
    {
      id: 5,
      title: 'Help & Support',
      icon: '❓',
      onPress: () => console.log('Help & Support'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Current Plan */}
        <View style={styles.planCard}>
          <Text style={styles.planLabel}>CURRENT PLAN</Text>
          <Text style={styles.planName}>Lite Plan</Text>
          <TouchableOpacity style={styles.viewPlanButton}>
            <Text style={styles.viewPlanButtonText}>View Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.optionsContainer}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index === settingsOptions.length - 1 && styles.optionItemLast,
              ]}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconContainer}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
              </View>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <View style={styles.logoutIconContainer}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.userInfoCard}>
          <Text style={styles.userInfoText}>
            Logged in as: {user?.fullName}
          </Text>
          <Text style={styles.userInfoText}>
            Role: {user?.role.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={styles.userInfoText}>
            Phone: {user?.countryCode} {user?.phoneNumber}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  planCard: {
    backgroundColor: '#EFF6FF',
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  planLabel: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  planName: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  viewPlanButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  viewPlanButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionsContainer: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionArrow: {
    fontSize: 28,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  logoutIcon: {
    fontSize: 20,
  },
  logoutText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.error,
  },
  userInfoCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  userInfoText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
});
