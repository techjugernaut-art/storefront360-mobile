import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';
import { salesService, Sale } from '../services/sales.service';

interface OrderCardData {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  itemsCount: number;
  paymentMethod: string;
  amount: number;
}

export default function SalesHistoryScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<OrderCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await salesService.getSales({
        limit: 50,
      });

      // Transform API data to match UI format
      const transformedOrders: OrderCardData[] = response.data.map((sale: Sale) => ({
        id: sale.id,
        orderNumber: sale.orderNumber,
        date: formatDate(sale.createdAt),
        time: formatTime(sale.createdAt),
        itemsCount: sale.items.length,
        paymentMethod: formatPaymentMethod(sale.paymentMethod),
        amount: sale.total,
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      Alert.alert('Error', 'Failed to load sales history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSales();
    setRefreshing(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    // Add ordinal suffix
    const suffix = getOrdinalSuffix(day);
    return `${day}${suffix} ${month}, ${year}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const formatPaymentMethod = (method: string): string => {
    const methodMap: { [key: string]: string } = {
      'cash': 'Cash',
      'mobile_money': 'Mobile Money',
      'card': 'Card',
    };
    return methodMap[method] || method;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.paymentMethod === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleViewOrder = (orderId: string) => {
    // Navigate to Order Details screen
    navigation.navigate('OrderDetails', { orderId });
  };

  const handleOrderMenu = (orderId: string) => {
    setSelectedOrder(orderId);
    Alert.alert(
      'Order Options',
      'What would you like to do?',
      [
        {
          text: 'View Details',
          onPress: () => handleViewOrder(orderId),
        },
        {
          text: 'Print Receipt',
          onPress: () => console.log('Print receipt:', orderId),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const applyFilter = (filter: string) => {
    setSelectedFilter(filter);
    setFilterModalVisible(false);
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
        <TouchableOpacity
          style={styles.filterButton}
          onPress={handleFilterPress}
        >
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

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading sales history...</Text>
        </View>
      ) : (
        /* Orders List */
        <ScrollView
          style={styles.ordersList}
          contentContainerStyle={styles.ordersListContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          {filteredOrders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleViewOrder(order.id)}
              activeOpacity={0.7}
            >
              {/* Order Header with Number and Menu */}
              <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #: {order.orderNumber}</Text>
                <TouchableOpacity
                  style={styles.orderOptionsButton}
                  onPress={() => handleOrderMenu(order.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.orderOptionsIcon}>⋮</Text>
                </TouchableOpacity>
              </View>

              {/* Order Date and Time */}
              <Text style={styles.orderDate}>
                {order.date} ({order.time})
              </Text>

              {/* Separator Line */}
              <View style={styles.separator} />

              {/* Order Details */}
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

          {/* Empty State */}
          {filteredOrders.length === 0 && !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📦</Text>
              <Text style={styles.emptyStateText}>No orders found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start making sales to see your order history'}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Payment Method</Text>
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.filterOption,
                selectedFilter === 'all' && styles.filterOptionSelected,
              ]}
              onPress={() => applyFilter('all')}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === 'all' && styles.filterOptionTextSelected,
              ]}>
                All Orders
              </Text>
              {selectedFilter === 'all' && <Text style={styles.checkMark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterOption,
                selectedFilter === 'Cash' && styles.filterOptionSelected,
              ]}
              onPress={() => applyFilter('Cash')}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === 'Cash' && styles.filterOptionTextSelected,
              ]}>
                Cash
              </Text>
              {selectedFilter === 'Cash' && <Text style={styles.checkMark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterOption,
                selectedFilter === 'Mobile Money' && styles.filterOptionSelected,
              ]}
              onPress={() => applyFilter('Mobile Money')}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === 'Mobile Money' && styles.filterOptionTextSelected,
              ]}>
                Mobile Money
              </Text>
              {selectedFilter === 'Mobile Money' && <Text style={styles.checkMark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterOption,
                selectedFilter === 'Card' && styles.filterOptionSelected,
              ]}
              onPress={() => applyFilter('Card')}
            >
              <Text style={[
                styles.filterOptionText,
                selectedFilter === 'Card' && styles.filterOptionTextSelected,
              ]}>
                Card
              </Text>
              {selectedFilter === 'Card' && <Text style={styles.checkMark}>✓</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: SIZES.xxl,
    fontWeight: '600',
    color: COLORS.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 24,
    color: COLORS.text,
    transform: [{ rotate: '90deg' }],
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
    opacity: 0.5,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
  },
  ordersList: {
    flex: 1,
  },
  ordersListContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  orderCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  orderNumber: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  orderOptionsButton: {
    padding: SPACING.xs,
  },
  orderOptionsIcon: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
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
    paddingHorizontal: SPACING.xl,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
    opacity: 0.3,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  modalTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    color: COLORS.textSecondary,
    fontWeight: '300',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: SIZES.md,
    color: COLORS.text,
  },
  filterOptionTextSelected: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  checkMark: {
    fontSize: SIZES.lg,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
});
