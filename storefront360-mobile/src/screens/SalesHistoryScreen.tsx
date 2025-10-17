import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  itemsCount: number;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Card';
  amount: number;
}

export default function SalesHistoryScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample orders - will be replaced with API data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: '121902389',
      date: '20th Dec, 2024',
      time: '3:12 PM',
      itemsCount: 3,
      paymentMethod: 'Cash',
      amount: 500.0,
    },
    {
      id: '2',
      orderNumber: '653454353',
      date: '20th Dec, 2024',
      time: '3:12 PM',
      itemsCount: 6,
      paymentMethod: 'Mobile Money',
      amount: 400.0,
    },
    {
      id: '3',
      orderNumber: '9834586211',
      date: '20th Dec, 2024',
      time: '3:12 PM',
      itemsCount: 2,
      paymentMethod: 'Cash',
      amount: 220.0,
    },
    {
      id: '4',
      orderNumber: '0596857422',
      date: '20th Dec, 2024',
      time: '3:12 PM',
      itemsCount: 1,
      paymentMethod: 'Cash',
      amount: 120.0,
    },
  ];

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.includes(searchQuery)
  );

  const handleViewOrder = (orderId: string) => {
    console.log('View order:', orderId);
    // Will navigate to Order Details screen
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
        <Text style={styles.headerTitle}>My Sales</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for orders"
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Orders List */}
      <ScrollView
        style={styles.ordersList}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            onPress={() => handleViewOrder(order.id)}
            activeOpacity={0.7}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>Order #: {order.orderNumber}</Text>
              <TouchableOpacity style={styles.orderOptionsButton}>
                <Text style={styles.orderOptionsIcon}>⋮</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.orderDate}>
              {order.date} ({order.time})
            </Text>

            <View style={styles.orderDetails}>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>No. Items:</Text>
                <Text style={styles.orderDetailValue}>{order.itemsCount}</Text>
              </View>

              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Payment Method:</Text>
                <Text style={styles.orderDetailValue}>{order.paymentMethod}</Text>
              </View>

              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Amount:</Text>
                <Text style={styles.orderAmount}>GHS {order.amount.toFixed(2)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No orders found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery
                ? 'Try a different search term'
                : 'Start making sales to see your order history'}
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 24,
    color: COLORS.text,
  },
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  ordersList: {
    flex: 1,
    padding: SPACING.lg,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  orderNumber: {
    fontSize: SIZES.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderOptionsButton: {
    padding: SPACING.xs,
  },
  orderOptionsIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  orderDate: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  orderDetails: {
    gap: SPACING.sm,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetailLabel: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  orderDetailValue: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderAmount: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyStateText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyStateSubtext: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
