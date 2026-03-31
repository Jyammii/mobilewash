import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { SkeletonCard } from '../../components/LoadingSkeleton';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [branches, setBranches] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getFirstName = (name) => {
    if (!name) return 'Customer';
    return name.split(' ')[0];
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [branchesData, bookingsData] = await Promise.all([
        apiService.getBranches(),
        apiService.getBookings(),
      ]);

      if (branchesData.success) {
        setBranches(branchesData.branches.slice(0, 5));
      }
      
      if (bookingsData.success) {
        const orders = bookingsData.bookings;
        setActiveOrder(orders.find(o => ['received', 'washing', 'drying', 'ready'].includes(o.status)) || null);
        setRecentOrders(orders.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderBranchCard = ({ item }) => (
    <TouchableOpacity style={styles.branchCard}>
      <View style={styles.branchIcon}>
        <Icon name="location" size={20} color={colors.primary} />
      </View>
      <View style={styles.branchInfo}>
        <Text style={styles.branchName}>{item.name}</Text>
        <Text style={styles.branchAddress}>{item.address}</Text>
      </View>
      <StatusBadge status={item.status} size="small" />
    </TouchableOpacity>
  );

  const renderOrderCard = ({ item }) => (
    <Card style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.trackingNumber}>{item.trackingNumber}</Text>
        <StatusBadge status={item.status} size="small" />
      </View>
      <Text style={styles.orderBranch}>{item.branch}</Text>
      <Text style={styles.orderService}>{item.service} • {item.loadSize}kg</Text>
      <TouchableOpacity 
        style={styles.viewButton}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      >
        <Text style={styles.viewButtonText}>View Details</Text>
        <Icon name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
    </Card>
  );

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
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon name="notifications-outline" size={24} color={colors.textPrimary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Active Booking Card */}
        {activeOrder && (
          <Card 
            style={styles.activeBookingCard}
            highlight
          >
            <View style={styles.activeBookingHeader}>
              <Text style={styles.activeBookingTitle}>Active Booking</Text>
              <Icon name="water" size={24} color={colors.accent} />
            </View>
            <Text style={styles.activeTracking}>{activeOrder.trackingNumber}</Text>
            <Text style={styles.activeBranch}>{activeOrder.branch}</Text>
            <View style={styles.activeBookingFooter}>
              <StatusBadge status={activeOrder.status} />
              <TouchableOpacity 
                style={styles.trackButton}
                onPress={() => navigation.navigate('Tracking', { orderId: activeOrder.id })}
              >
                <Text style={styles.trackButtonText}>Track Order</Text>
                <Icon name="arrow-forward" size={16} color={colors.textInverse} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Book')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
              <Icon name="add-circle" size={28} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Book Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Orders')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.accent + '20' }]}>
              <Icon name="search" size={28} color={colors.accent} />
            </View>
            <Text style={styles.quickActionText}>Track Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('DeliveryTracking')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.success + '20' }]}>
              <Icon name="car" size={28} color={colors.success} />
            </View>
            <Text style={styles.quickActionText}>Delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Chat')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: colors.warning + '20' }]}>
              <Icon name="chatbubbles" size={28} color={colors.warning} />
            </View>
            <Text style={styles.quickActionText}>IkotAsk</Text>
          </TouchableOpacity>
        </View>

        {/* Nearby Branches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Branches</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={branches}
            renderItem={renderBranchCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.branchList}
          />
        </View>

        {/* Recent Orders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <SkeletonCard />
          ) : recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <Card key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.trackingNumber}>{order.trackingNumber}</Text>
                  <StatusBadge status={order.status} size="small" />
                </View>
                <Text style={styles.orderBranch}>{order.branch}</Text>
                <Text style={styles.orderService}>{order.service} • {order.loadSize}kg</Text>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                  <Icon name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Icon name="receipt-outline" size={40} color={colors.textTertiary} />
              <Text style={styles.emptyText}>No orders yet</Text>
            </Card>
          )}
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
  activeBookingCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activeBookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeBookingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  activeTracking: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  activeBranch: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  activeBookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  trackButtonText: {
    color: colors.textInverse,
    fontWeight: '600',
    fontSize: 14,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  branchList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  branchCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    width: 180,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  branchIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  branchAddress: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  orderCard: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  orderBranch: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderService: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewButtonText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  emptyCard: {
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
});

export default HomeScreen;
