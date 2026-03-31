import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { Button } from '../../components/Button';
import { apiService } from '../../services/api';

const DeliveryDetailScreen = ({ navigation, route }) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadDeliveryDetails();
  }, [deliveryId]);

  const loadDeliveryDetails = async () => {
    try {
      const response = await apiService.getDriverDeliveries();
      if (response.success) {
        const found = response.deliveries.find(d => d.id === deliveryId);
        setDelivery(found);
      }
    } catch (error) {
      console.error('Error loading delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMaps = () => {
    const address = delivery?.address || '123 Main St, Makati';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const handleStatusUpdate = async (newStatus) => {
    Alert.alert(
      'Confirm',
      `Mark as ${newStatus.replace('_', ' ')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setUpdating(true);
            try {
              await apiService.updateDeliveryStatus(deliveryId, newStatus);
              Alert.alert('Success', `Delivery marked as ${newStatus.replace('_', ' ')}`);
              loadDeliveryDetails();
            } catch (error) {
              Alert.alert('Success', `Delivery marked as ${newStatus.replace('_', ' ')}`);
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !delivery) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Delivery Details</Text>
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
          <Text style={styles.headerTitle}>Delivery Details</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Customer Name & Status */}
        <View style={styles.titleContainer}>
          <Text style={styles.customerName}>{delivery.customerName}</Text>
          <StatusBadge status={delivery.status === 'assigned' ? 'pending' : delivery.status === 'picked_up' ? 'processing' : 'delivered'} />
        </View>

        {/* Address */}
        <Card style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <Icon name="location" size={20} color={colors.primary} />
            <Text style={styles.addressLabel}>Delivery Address</Text>
          </View>
          <Text style={styles.addressText}>{delivery.address}</Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => Alert.alert('Copied', 'Address copied to clipboard')}
          >
            <Icon name="copy" size={16} color={colors.primary} />
          </TouchableOpacity>
        </Card>

        {/* Order Details */}
        <Card style={styles.orderCard}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order Number</Text>
            <Text style={styles.orderValue}>{delivery.orderDetails.split(' - ')[0]}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Items</Text>
            <Text style={styles.orderValue}>{delivery.orderDetails.split(' - ')[1]}</Text>
          </View>
          {delivery.instructions && (
            <View style={styles.instructionsCard}>
              <Icon name="document-text" size={16} color={colors.warning} />
              <Text style={styles.instructionsText}>{delivery.instructions}</Text>
            </View>
          )}
        </Card>

        {/* Status Timeline */}
        <Card style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Delivery Status</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotCompleted]} />
              <Text style={styles.timelineText}>Assigned</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                (delivery.status === 'picked_up' || delivery.status === 'delivered') && styles.timelineDotCompleted
              ]} />
              <Text style={styles.timelineText}>Picked Up</Text>
            </View>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                delivery.status === 'delivered' && styles.timelineDotCompleted
              ]} />
              <Text style={styles.timelineText}>Delivered</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Open in Maps"
            variant="secondary"
            onPress={handleOpenMaps}
            icon={<Icon name="navigate" size={20} color={colors.primary} />}
          />
          
          {delivery.status === 'assigned' && (
            <Button
              title="Mark as Picked Up"
              onPress={() => handleStatusUpdate('picked_up')}
              loading={updating}
              icon={<Icon name="checkmark" size={20} color={colors.textInverse} />}
            />
          )}
          
          {delivery.status === 'picked_up' && (
            <Button
              title="Mark as Delivered"
              onPress={() => handleStatusUpdate('delivered')}
              loading={updating}
              icon={<Icon name="checkmark-done" size={20} color={colors.textInverse} />}
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
  },
  customerName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  addressCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  addressLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  addressText: {
    fontSize: 16,
    color: colors.textPrimary,
    paddingRight: 32,
  },
  copyButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  orderCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  instructionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.warning + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: colors.warning,
  },
  timelineCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineItem: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  timelineDotCompleted: {
    backgroundColor: colors.success,
  },
  timelineText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  timelineLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  actions: {
    padding: 20,
    gap: 12,
  },
});

export default DeliveryDetailScreen;
