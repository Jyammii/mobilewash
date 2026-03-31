import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { ProgressTracker } from '../../components/ProgressTracker';
import { Button } from '../../components/Button';
import { apiService } from '../../services/api';

const statusSteps = ['received', 'washing', 'drying', 'ready', 'delivered'];

const OrderDetailScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const response = await apiService.getBookingById(orderId);
      if (response.success) {
        setOrder(response.booking);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    if (!order) return 0;
    const index = statusSteps.indexOf(order.status);
    return index >= 0 ? index : 0;
  };

  if (loading || !order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{order.trackingNumber}</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <StatusBadge status={order.status} size="large" />
        </View>

        {/* Progress Tracker */}
        <Card style={styles.progressCard}>
          <ProgressTracker currentStep={getCurrentStep()} />
        </Card>

        {/* Order Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          
          <View style={styles.infoRow}>
            <Icon name="location" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Branch</Text>
              <Text style={styles.infoValue}>{order.branch}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="water" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Service</Text>
              <Text style={styles.infoValue}>{order.service}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="scale" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Load Size</Text>
              <Text style={styles.infoValue}>{order.loadSize} kg</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date Booked</Text>
              <Text style={styles.infoValue}>{order.date}</Text>
            </View>
          </View>
        </Card>

        {/* Payment Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.infoRow}>
            <Icon name="wallet" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Amount</Text>
              <Text style={[styles.infoValue, styles.amountText]}>₱{order.amount}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="card" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{order.paymentMethod || 'GCash'}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Icon name="checkmark-circle" size={20} color={colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <StatusBadge status="paid" size="small" />
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Track Order"
            onPress={() => navigation.navigate('Tracking', { orderId: order.id })}
            icon={<Icon name="location" size={20} color={colors.textInverse} />}
          />
          
          {order.delivery && (
            <Button
              title="Track Delivery"
              variant="secondary"
              onPress={() => navigation.navigate('DeliveryTracking', { orderId: order.id })}
              icon={<Icon name="car" size={20} color={colors.primary} />}
            />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 40,
  },
  statusContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
});

export default OrderDetailScreen;
