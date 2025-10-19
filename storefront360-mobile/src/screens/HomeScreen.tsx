import React, { useEffect, useState } from 'react';
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
import api from '../services/api';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalProfit: 0,
    totalExpenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      const response = await api.get('/api/dashboard/metrics');
      const data = response.data.data || response.data;

      setMetrics({
        totalSales: data.totalSales || data.total_sales || 0,
        totalProfit: data.grossProfit || data.gross_profit || 0,
        totalExpenses: data.totalExpenses || data.total_expenses || 0,
      });
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      // Use fallback data on error
      setMetrics({
        totalSales: 850.00,
        totalProfit: 350.00,
        totalExpenses: 500.00,
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 1,
      title: 'Sales History',
      icon: '🛒',
      bgColor: '#D1F4E0',
      iconColor: '#10B981',
      screen: 'SalesHistory',
    },
    {
      id: 2,
      title: 'Products',
      icon: '📦',
      bgColor: '#DBEAFE',
      iconColor: '#3B82F6',
      screen: 'Products',
    },
    {
      id: 3,
      title: 'Reports',
      icon: '📊',
      bgColor: '#E9D5FF',
      iconColor: '#A855F7',
      screen: 'Reports',
    },
    {
      id: 4,
      title: 'Points & Rewards',
      icon: '🎁',
      bgColor: '#FEE2E2',
      iconColor: '#EF4444',
      screen: 'Rewards',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Storefront</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Store Profile Card & Metrics */}
        <View style={styles.metricsSection}>
          {/* Store Profile */}
          <View style={styles.storeCard}>
            <View style={styles.storeLogoContainer}>
              <View style={styles.storeLogo}>
                <Text style={styles.storeLogoText}>LT</Text>
              </View>
              <View style={styles.verifiedBadge}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
            </View>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>
                {user?.fullName || 'Luminar Threads'}
              </Text>
              <Text style={styles.storeLocation}>Teshie, Accra</Text>
            </View>
            <View style={styles.storeActions}>
              <TouchableOpacity style={styles.storeActionBtn}>
                <Text style={styles.storeCheckIcon}>✓</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today Badge */}
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>Today</Text>
          </View>

          {/* Total Sales */}
          <View style={styles.totalSalesContainer}>
            <Text style={styles.totalSalesLabel}>Total Sales</Text>
            <Text style={styles.totalSalesValue}>
              GHS {metrics.totalSales.toFixed(2)}
            </Text>
          </View>

          {/* Profit & Expenses */}
          <View style={styles.subMetricsRow}>
            <View style={styles.subMetricCard}>
              <Text style={styles.subMetricLabel}>Total Profit</Text>
              <Text style={styles.subMetricValue}>GHS {metrics.totalProfit}</Text>
            </View>
            <View style={styles.subMetricCard}>
              <Text style={styles.subMetricLabel}>Total Expenses</Text>
              <Text style={styles.subMetricValue}>GHS {metrics.totalExpenses}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              activeOpacity={0.7}
              onPress={() => {
                if (action.screen && navigation) {
                  navigation.navigate(action.screen);
                }
              }}
            >
              <View
                style={[
                  styles.actionIconCircle,
                  { backgroundColor: action.bgColor },
                ]}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  metricsSection: {
    backgroundColor: '#E0E7FF',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 20,
    alignItems: 'center',
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    width: '100%',
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.lg,
  },
  storeLogoContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  storeLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  verifiedBadge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  checkMark: {
    fontSize: 12,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  storeLocation: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  storeActions: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeActionBtn: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeCheckIcon: {
    fontSize: 20,
  },
  todayBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginBottom: SPACING.lg,
  },
  todayText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalSalesContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalSalesLabel: {
    fontSize: SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  totalSalesValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subMetricsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  subMetricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  subMetricLabel: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  subMetricValue: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
});
