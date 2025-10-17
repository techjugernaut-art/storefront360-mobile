import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';

type TabType = 'summary' | 'products';
type DateFilter = 'today' | 'week' | 'month' | 'custom';
type PaymentMethodFilter = 'all' | 'cash' | 'mobile_money' | 'card';

export default function ReportsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [dateFilter, setDateFilter] = useState<DateFilter>('today');
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethodFilter>('all');

  // Sample data - will be replaced with API data
  const reportData = {
    totalSales: 9000.0,
    totalCost: 7500.0,
    grossProfit: 1500.0,
    date: '13 January 2025',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'summary' && styles.activeTab]}
            onPress={() => setActiveTab('summary')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'summary' && styles.activeTabText,
              ]}
            >
              Summary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.activeTab]}
            onPress={() => setActiveTab('products')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'products' && styles.activeTabText,
              ]}
            >
              Products
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          {/* Payment Method Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Payment Method</Text>
            <TouchableOpacity style={styles.filterDropdown}>
              <Text style={styles.filterValue}>
                {paymentFilter === 'all' ? 'All' : paymentFilter}
              </Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* Date Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Date</Text>
            <TouchableOpacity style={styles.filterDropdown}>
              <Text style={styles.filterValue}>
                {dateFilter === 'today' ? 'Today' : dateFilter}
              </Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Display */}
        <View style={styles.dateDisplay}>
          <Text style={styles.dateText}>{reportData.date}</Text>
        </View>

        {/* Metrics */}
        <View style={styles.metricsContainer}>
          {/* Total Sales */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Sales</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricCurrency}>GHS</Text>
              <Text style={styles.metricValue}>
                {reportData.totalSales.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <Text style={styles.metricDescription}>
              Calculated as the sum of all selling prices for the sold products
            </Text>
          </View>

          {/* Total Cost */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Cost</Text>
            <View style={styles.metricValueRow}>
              <Text style={styles.metricCurrency}>GHS</Text>
              <Text style={styles.metricValue}>
                {reportData.totalCost.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <Text style={styles.metricDescription}>
              Calculated as the sum of all cost prices for the sold products
            </Text>
          </View>

          {/* Gross Profit */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Gross Profit</Text>
            <View style={styles.metricValueRow}>
              <Text style={[styles.metricCurrency, { color: COLORS.success }]}>
                GHS
              </Text>
              <Text style={[styles.metricValue, { color: COLORS.success }]}>
                {reportData.grossProfit.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <Text style={styles.metricDescription}>
              Earnings from sales after subtracting product costs.
            </Text>
          </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeTabText: {
    color: COLORS.surface,
  },
  filtersContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
    gap: SPACING.md,
  },
  filterSection: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterLabel: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  filterDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
  },
  filterValue: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  filterArrow: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dateDisplay: {
    backgroundColor: '#EFF6FF',
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  metricsContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  metricCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricLabel: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: SPACING.sm,
  },
  metricCurrency: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  metricValue: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  metricDescription: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});
