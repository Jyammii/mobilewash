import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { ProgressTracker } from '../../components/ProgressTracker';
import { apiService } from '../../services/api';

const statusSteps = ['Order Received', 'Washing', 'Drying', 'Ready for Pickup', 'Delivered'];

const statusDescriptions = {
  'Order Received': 'Your laundry has been received at the branch.',
  'Washing': 'Your laundry is currently being washed.',
  'Drying': 'Your laundry is in the drying process.',
  'Ready for Pickup': 'Your laundry is ready for pickup!',
  'Delivered': 'Your laundry has been delivered.',
};

const TrackingScreen = ({ navigation, route }) => {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
    const interval = setInterval(loadOrder, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  const loadOrder = async () => {
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
    const statusMap = {
      received: 0,
      washing: 1,
      drying: 2,
      ready: 3,
      delivered: 4,
    };
    return statusMap[order?.status] || 0;
  };

  const currentStatus = statusSteps[getCurrentStep()];
  const statusDescription = statusDescriptions[currentStatus];

  const getEstimatedTime = () => {
    const step = getCurrentStep();
    const times = ['Now', '30 minutes', '1 hour', '2 hours', 'Delivered'];
    return times[step];
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Tracking Number */}
        <View style={styles.trackingContainer}>
          <Text style={styles.trackingLabel}>Tracking Number</Text>
          <Text style={styles.trackingNumber}>{order?.trackingNumber || 'WA-2024-001'}</Text>
        </View>

        {/* Progress Tracker */}
        <Card style={styles.progressCard}>
          <ProgressTracker currentStep={getCurrentStep()} showLabels />
        </Card>

        {/* Current Status */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <Icon name="water" size={32} color={colors.primary} />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{currentStatus}</Text>
              <Text style={styles.statusTime}>ETA: {getEstimatedTime()}</Text>
            </View>
          </View>
          <Text style={styles.statusDescription}>{statusDescription}</Text>
        </Card>

        {/* Branch Contact */}
        <Card style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Branch Contact</Text>
          <View style={styles.contactRow}>
            <Icon name="location" size={20} color={colors.textSecondary} />
            <Text style={styles.contactText}>{order?.branch || 'Triplets Makati'}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="call" size={20} color={colors.textSecondary} />
            <Text style={styles.contactText}>02-8123-4567</Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Icon name="call" size={20} color={colors.textInverse} />
            <Text style={styles.callButtonText}>Call Branch</Text>
          </TouchableOpacity>
        </Card>

        {/* Order Details */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{order?.service || 'Wash & Dry'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Load Size</Text>
            <Text style={styles.detailValue}>{order?.loadSize || '5'} kg</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Branch</Text>
            <Text style={styles.detailValue}>{order?.branch || 'Triplets Makati'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{order?.date || '2024-01-15'}</Text>
          </View>
        </Card>
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
  trackingContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  trackingLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  trackingNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statusCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.primary + '10',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  statusTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  contactCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  callButtonText: {
    color: colors.textInverse,
    fontWeight: '600',
    fontSize: 16,
  },
  detailsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

export default TrackingScreen;
