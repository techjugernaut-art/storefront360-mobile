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

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();

  // Sample data - will be replaced with actual API data
  const todaySales = 850.0;
  const totalProfit = 350.0;
  const totalExpenses = 500.0;

  const quickActions = [
    { id: 1, title: 'Sales History', icon: '📊', screen: 'SalesHistory' },
    { id: 2, title: 'Products', icon: '📦', screen: 'Products' },
    { id: 3, title: 'Reports', icon: '📈', screen: 'Reports' },
    { id: 4, title: 'Points & Rewards', icon: '🎁', screen: 'Rewards' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Profile Header */}
        <View style={styles.header}>
          <View style={styles.storeInfo}>
            <View style={styles.storeLogo}>
              <Text style={styles.storeLogoText}>S</Text>
            </View>
            <View style={styles.storeDetails}>
              <Text style={styles.storeName}>Storefront 360</Text>
              <Text style={styles.storeLocation}>Teshie, Accra</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>

          <View style={styles.mainMetricCard}>
            <Text style={styles.mainMetricLabel}>Total Sales</Text>
            <Text style={styles.mainMetricValue}>GHS {todaySales.toFixed(2)}</Text>
          </View>

          <View style={styles.subMetricsRow}>
            <View style={styles.subMetricCard}>
              <Text style={styles.subMetricLabel}>Total Profit</Text>
              <Text style={[styles.subMetricValue, { color: COLORS.success }]}>
                GHS {totalProfit}
              </Text>
            </View>
            <View style={styles.subMetricCard}>
              <Text style={styles.subMetricLabel}>Total Expenses</Text>
              <Text style={[styles.subMetricValue, { color: COLORS.error }]}>
                GHS {totalExpenses}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                activeOpacity={0.7}
                onPress={() => {
                  // Navigation will be implemented
                  console.log('Navigate to:', action.screen);
                }}
              >
                <View style={styles.actionIconContainer}>
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Welcome Message for First Time Users */}
        {user?.role === 'super_admin' && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>👋 Welcome, {user?.fullName}!</Text>
            <Text style={styles.infoText}>
              Start managing your store by creating your first sale or adding products.
            </Text>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  storeLogoText: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  storeDetails: {
    justifyContent: 'center',
  },
  storeName: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  storeLocation: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  metricsContainer: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  mainMetricCard: {
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.md,
  },
  mainMetricLabel: {
    fontSize: SIZES.md,
    color: COLORS.surface,
    opacity: 0.9,
    marginBottom: SPACING.xs,
  },
  mainMetricValue: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  subMetricsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  subMetricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subMetricLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  subMetricValue: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
  },
  actionsContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionCard: {
    width: '47.5%',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  actionIcon: {
    fontSize: 32,
  },
  actionTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    margin: SPACING.lg,
    marginTop: 0,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  infoTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
});
