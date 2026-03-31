import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { apiService } from '../../services/api';

const tabs = ['Pending', 'Completed'];

const DriverDeliveriesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const response = await apiService.getDriverDeliveries();
      if (response.success) {
        setDeliveries(response.deliveries);
      }
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    if (activeTab === 'Pending') return delivery.status === 'assigned' || delivery.status === 'picked_up';
    if (activeTab === 'Completed') return delivery.status === 'delivered';
    return true;
  });

  const renderDeliveryCard = ({ item }) => (
    <Card 
      style={styles.deliveryCard}
      onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: item.id })}
    >
      <View style={styles.deliveryHeader}>
        <View>
          <Text style={styles.customerName}>{item.customerName}</Text>
          <View style={styles.addressContainer}>
            <Icon name="location" size={14} color={colors.textSecondary} />
            <Text style={styles.address}>{item.address}</Text>
          </View>
        </View>
        <StatusBadge status={item.status === 'assigned' ? 'pending' : item.status === 'picked_up' ? 'processing' : 'delivered'} />
      </View>
      
      <View style={styles.orderInfo}>
        <Icon name="receipt" size={16} color={colors.textSecondary} />
        <Text style={styles.orderText}>{item.orderDetails}</Text>
      </View>
      
      {item.instructions && (
        <View style={styles.instructionsContainer}>
          <Icon name="document-text" size={14} color={colors.warning} />
          <Text style={styles.instructionsText}>{item.instructions}</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.viewDetailsButton}
        onPress={() => navigation.navigate('DeliveryDetail', { deliveryId: item.id })}
      >
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Icon name="chevron-forward" size={16} color={colors.primary} />
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>My Deliveries</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(renderTab)}
      </View>

      {/* Deliveries List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : filteredDeliveries.length === 0 ? (
        <EmptyState
          icon="car-outline"
          title="No Deliveries"
          message={`You don't have any ${activeTab.toLowerCase()} deliveries.`}
        />
      ) : (
        <FlatList
          data={filteredDeliveries}
          renderItem={renderDeliveryCard}
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
  deliveryCard: {
    marginBottom: 4,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  orderText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warning + '15',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 12,
    color: colors.warning,
    flex: 1,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewDetailsText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DriverDeliveriesScreen;
