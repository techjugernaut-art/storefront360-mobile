import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, SPACING } from '../constants/config';

type NotificationType = 'all' | 'unread' | 'alerts' | 'offers';

interface Notification {
  id: string;
  type: 'alert' | 'offer' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionText?: string;
}

export default function NotificationsScreen({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Low Stocks',
      message: 'Your product "Nido Tin" is running low on stock. Restock to avoid missing out on sales.',
      timestamp: '1h ago',
      isRead: false,
      actionText: 'Restock Now',
    },
    {
      id: '2',
      type: 'offer',
      title: 'Unlock Premium Benefits',
      message: 'Upgrade to Premium to enjoy Upgrade to Premium to enjoy marketing tools.',
      timestamp: '1h ago',
      isRead: false,
      actionText: 'Upgrade Now',
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Great Job!',
      message: 'Congratulations on 100 sales! Keep up the amazing work!',
      timestamp: '3d ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'alert',
      title: 'Low Stocks Alert!',
      message: 'Your product "Cerelac" is running low on stock. Restock to avoid missing out on sales.',
      timestamp: '4d ago',
      isRead: true,
      actionText: 'Restock Now',
    },
  ]);

  const filterNotifications = (notifications: Notification[]) => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      case 'alerts':
        return notifications.filter((n) => n.type === 'alert');
      case 'offers':
        return notifications.filter((n) => n.type === 'offer');
      default:
        return notifications;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const filteredNotifications = filterNotifications(notifications);

  // Group notifications by time period
  const todayNotifications = filteredNotifications.filter((n) =>
    n.timestamp.includes('h ago') || n.timestamp.includes('m ago')
  );
  const last7DaysNotifications = filteredNotifications.filter(
    (n) => n.timestamp.includes('d ago') && parseInt(n.timestamp) <= 7
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {(['all', 'unread', 'alerts', 'offers'] as NotificationType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : (
        /* Notifications List */
        <ScrollView
          style={styles.notificationsList}
          contentContainerStyle={styles.notificationsListContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Today Section */}
          {todayNotifications.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Today</Text>
              {todayNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.notificationCardUnread,
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>

                    {notification.actionText && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                          {notification.actionText}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <Text style={styles.notificationTimestamp}>
                      {notification.timestamp}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Last 7 Days Section */}
          {last7DaysNotifications.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Last 7 days</Text>
              {last7DaysNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.notificationCardUnread,
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>

                    {notification.actionText && (
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>
                          {notification.actionText}
                        </Text>
                      </TouchableOpacity>
                    )}

                    <Text style={styles.notificationTimestamp}>
                      {notification.timestamp}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔔</Text>
              <Text style={styles.emptyStateText}>No notifications</Text>
              <Text style={styles.emptyStateSubtext}>
                {activeFilter === 'all'
                  ? "You're all caught up!"
                  : `No ${activeFilter} notifications at the moment`}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
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
  headerTitle: {
    fontSize: SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '300',
  },
  filterContainer: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: SPACING.md,
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  filterButtonActive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.text,
  },
  filterButtonText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: COLORS.text,
    fontWeight: '600',
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
  notificationsList: {
    flex: 1,
  },
  notificationsListContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  notificationCard: {
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
  notificationCardUnread: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  notificationMessage: {
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  actionButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  actionButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  notificationTimestamp: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
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
});
