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

type TabType = 'milestones' | 'rewards';

interface Milestone {
  id: string;
  title: string;
  points: number;
  isLocked: boolean;
  icon: string;
}

export default function RewardsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<TabType>('rewards');
  const [loading, setLoading] = useState(false);
  const [currentPoints] = useState(130);

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'First Sale',
      points: 50,
      isLocked: true,
      icon: '🏆',
    },
    {
      id: '2',
      title: 'Quick Seller',
      points: 100,
      isLocked: true,
      icon: '🏆',
    },
    {
      id: '3',
      title: 'Big Seller',
      points: 200,
      isLocked: true,
      icon: '🏆',
    },
    {
      id: '4',
      title: 'Referral Star',
      points: 250,
      isLocked: true,
      icon: '🏆',
    },
    {
      id: '5',
      title: 'Sales Champ',
      points: 300,
      isLocked: true,
      icon: '🏆',
    },
    {
      id: '6',
      title: 'Collector',
      points: 400,
      isLocked: true,
      icon: '🏆',
    },
  ];

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
        <Text style={styles.headerTitle}>Points & Rewards</Text>
        <View style={styles.backButton} />
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading rewards...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Points Balance Card */}
          <View style={styles.pointsCard}>
            <Text style={styles.pointsLabel}>YOU'VE EARNED</Text>
            <Text style={styles.pointsValue}>{currentPoints}</Text>
            <Text style={styles.pointsText}>Points</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'milestones' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('milestones')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'milestones' && styles.tabTextActive,
                ]}
              >
                Milestones
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'rewards' && styles.tabActive,
              ]}
              onPress={() => setActiveTab('rewards')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'rewards' && styles.tabTextActive,
                ]}
              >
                Rewards
              </Text>
            </TouchableOpacity>
          </View>

          {/* How to Earn More Points Section */}
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <View style={styles.infoIconContainer}>
                <Text style={styles.infoIcon}>?</Text>
              </View>
              <Text style={styles.infoTitle}>How to earn more points</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.infoText}>
                  Each sale you make earns you <Text style={styles.boldText}>10 points</Text>.
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.infoText}>
                  Stay active daily to <Text style={styles.boldText}>5 points</Text> each day.
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.infoText}>
                  Earn bonus points by achieving sales milestones.
                </Text>
              </View>
            </View>
          </View>

          {/* Milestones/Rewards Grid */}
          <View style={styles.milestonesGrid}>
            {milestones.map((milestone, index) => (
              <View
                key={milestone.id}
                style={[
                  styles.milestoneCard,
                  (index + 1) % 3 === 0 && styles.milestoneCardLast,
                ]}
              >
                {milestone.isLocked && (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockIcon}>🔒</Text>
                  </View>
                )}
                <View style={styles.milestoneIconContainer}>
                  <View style={styles.milestoneIconCircle}>
                    <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
                  </View>
                </View>
                <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                <Text style={styles.milestonePoints}>{milestone.points} points</Text>
              </View>
            ))}
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: SPACING.xl }} />
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: SIZES.xl,
    fontWeight: '600',
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
  content: {
    flex: 1,
  },
  pointsCard: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    marginTop: SPACING.xl,
    padding: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#93C5FD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsLabel: {
    fontSize: SIZES.xs,
    color: COLORS.text,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
  },
  pointsValue: {
    fontSize: 72,
    fontWeight: 'bold',
    color: COLORS.primary,
    lineHeight: 80,
  },
  pointsText: {
    fontSize: SIZES.xl,
    color: COLORS.text,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.text,
  },
  infoCard: {
    backgroundColor: COLORS.background,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  infoIcon: {
    fontSize: SIZES.md,
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  infoTitle: {
    fontSize: SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  infoContent: {
    gap: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    fontSize: SIZES.lg,
    color: COLORS.text,
    marginRight: SPACING.sm,
    lineHeight: 22,
  },
  infoText: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: 'bold',
  },
  milestonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  milestoneCard: {
    width: '30%',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  milestoneCardLast: {
    marginRight: 0,
  },
  lockBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  lockIcon: {
    fontSize: 14,
  },
  milestoneIconContainer: {
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  milestoneIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneIcon: {
    fontSize: 32,
  },
  milestoneTitle: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  milestonePoints: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
