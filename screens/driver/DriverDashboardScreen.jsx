import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const DriverDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    pending: 0,
    distanceCovered: 0,
  });
  const [activeDelivery, setActiveDelivery] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = (name) => {
    if (!name) return 'Driver';
    return name.split(' ')[0];
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await apiService.getDriverDeliveries();
      if (response.success) {
        const deliveries = response.deliveries;
        const active = deliveries.find(d => d.status === 'assigned');
        setActiveDelivery(active || null);
        setStats({
          totalDeliveries: deliveries.length,
          completedToday: deliveries.filter(d => d.status === 'delivered').length,
          pending: deliveries.filter(d => d.status === 'assigned').length,
          distanceCovered: Math.floor(Math.random() * 50 + 10),
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{getFirstName(user?.name)}!</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('DriverNotifications')}
          >
            <Icon name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>1</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalDeliveries}</Text>
              <Text style={styles.statLabel}>Assigned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedToday}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </Card>

        {/* Active Delivery */}
        {activeDelivery && (
          <Card style={styles.activeDeliveryCard} highlight>
            <View style={styles.activeDeliveryHeader}>
              <Text style={styles.activeDeliveryTitle}>Active Delivery</Text>
              <StatusBadge status="assigned" />
            </View>
            <Text style={styles.customerName}>{activeDelivery.customerName}</Text>
            <View style={styles.deliveryAddress}>
              <Icon name="location" size={16} color={colors.textSecondary} />
              <Text style={styles.addressText}>{activeDelivery.address}</Text>
            </View>
            <Text style={styles.orderDetails}>{activeDelivery.orderDetails}</Text>
            <TouchableOpacity 
              style={styles.goToDeliveryButton}
              onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: activeDelivery.id })}
            >
              <Text style={styles.goToDeliveryText}>Go to Delivery</Text>
              <Icon name="arrow-forward" size={16} color={colors.textInverse} />
            </TouchableOpacity>
          </Card>
        )}

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statsBarItem}>
            <Icon name="navigate" size={20} color={colors.accent} />
            <Text style={styles.statsBarValue}>{stats.distanceCovered} km</Text>
            <Text style={styles.statsBarLabel}>Distance Today</Text>
          </View>
          <View style={styles.statsBarDivider} />
          <View style={styles.statsBarItem}>
            <Icon name="checkmark-done" size={20} color={colors.success} />
            <Text style={styles.statsBarValue}>{stats.completedToday}</Text>
            <Text style={styles.statsBarLabel}>Completed</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('DriverDeliveries')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
              <Icon name="list" size={28} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>My Deliveries</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('DriverNotifications')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.warning + '20' }]}>
              <Icon name="notifications" size={28} color={colors.warning} />
            </View>
            <Text style={styles.quickActionText}>Notifications</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  activeDeliveryCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  activeDeliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeDeliveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  customerName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  deliveryAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  orderDetails: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  goToDeliveryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  goToDeliveryText: {
    color: colors.textInverse,
    fontWeight: '600',
    fontSize: 16,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
  },
  statsBarItem: {
    flex: 1,
    alignItems: 'center',
  },
  statsBarValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statsBarLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsBarDivider: {
    width: 1,
    height: 50,
    backgroundColor: colors.border,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

export default DriverDashboardScreen;
