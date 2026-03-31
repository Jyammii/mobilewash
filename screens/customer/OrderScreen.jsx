import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { SkeletonList } from '../../components/LoadingSkeleton';
import { EmptyState } from '../../components/EmptyState';
import { apiService } from '../../services/api';

const tabs = ['All', 'Active', 'Completed', 'Cancelled'];

const OrdersScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await apiService.getBookings();
      if (response.success) {
        setOrders(response.bookings);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return ['received', 'washing', 'drying', 'ready'].includes(order.status);
    if (activeTab === 'Completed') return order.status === 'delivered';
    if (activeTab === 'Cancelled') return order.status === 'cancelled';
    return true;
  });

  const getStatusColor = (status) => {
    const statusColors = {
      received: colors.statusReceived,
      washing: colors.statusWashing,
      drying: colors.statusDrying,
      ready: colors.statusReady,
      delivered: colors.statusDelivered,
      cancelled: colors.statusCancelled,
    };
    return statusColors[status] || colors.textSecondary;
  };

  const renderOrderCard = ({ item }) => (
    <Card 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.trackingNumber}>{item.trackingNumber}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.orderDetailItem}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.orderDetailText}>{item.branch}</Text>
        </View>
        <View style={styles.orderDetailItem}>
          <Icon name="water-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.orderDetailText}>{item.service}</Text>
        </View>
        <View style={styles.orderDetailItem}>
          <Icon name="scale-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.orderDetailText}>{item.loadSize}kg</Text>
        </View>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderAmount}>₱{item.amount}</Text>
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon name="chevron-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderTab = (tab) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {tab}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(renderTab)}
      </View>

      {/* Orders List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <SkeletonList count={3} />
        </View>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title="No Orders"
          message={`You don't have any ${activeTab.toLowerCase()} orders yet.`}
          actionLabel="Book Now"
          onAction={() => navigation.navigate('Book')}
        />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.backgroundDark,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.textInverse,
  },
  listContent: {
    padding: 20,
    gap: 12,
  },
  orderCard: {
    marginBottom: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trackingNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  orderDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  loadingContainer: {
    padding: 20,
  },
});

export default OrdersScreen;
