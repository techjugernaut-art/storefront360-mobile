import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS, SIZES, SPACING } from '../constants/config';

export default function DashboardScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.fullName}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Account</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>
              {user?.countryCode} {user?.phoneNumber}
            </Text>
          </View>
          {user?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role:</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user?.role.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$0.00</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Transactions</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionText}>New Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionText}>Products</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Customers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
        </View>

        {/* Success Message */}
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>🎉 Welcome to Storefront 360!</Text>
          <Text style={styles.successText}>
            You're successfully logged in. The frontend is connected to the production API on Heroku.
          </Text>
          <Text style={styles.successText}>
            Next: We'll build the complete POS interface, product management, and all other features!
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  greeting: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  logoutText: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: COLORS.surface,
    fontSize: SIZES.xs,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  successCard: {
    backgroundColor: '#D1FAE5',
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  successTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: SPACING.sm,
  },
  successText: {
    fontSize: SIZES.md,
    color: '#065F46',
    marginBottom: SPACING.xs,
    lineHeight: 22,
  },
});
