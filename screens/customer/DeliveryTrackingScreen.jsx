import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const { width, height } = Dimensions.get('window');

const DeliveryTrackingScreen = ({ navigation, route }) => {
  const { orderId } = route.params || {};
  const [driverLocation, setDriverLocation] = useState({ latitude: 14.5995, longitude: 120.9842 });
  const [eta, setEta] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate driver movement
      setDriverLocation(prev => ({
        latitude: prev.latitude + 0.001,
        longitude: prev.longitude + 0.001,
      }));
      setEta(prev => Math.max(0, prev - 1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Delivery</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Icon name="map" size={80} color={colors.primary} />
          <Text style={styles.mapText}>Live Map View</Text>
          <Text style={styles.mapSubtext}>Driver location updates every 10 seconds</Text>
          
          {/* Driver Marker Placeholder */}
          <View style={styles.driverMarker}>
            <Icon name="car" size={24} color={colors.textInverse} />
          </View>
          
          {/* Destination Marker Placeholder */}
          <View style={styles.destinationMarker}>
            <Icon name="location" size={24} color={colors.error} />
          </View>
        </View>
      </View>

      {/* Bottom Sheet */}
      <Card style={styles.bottomSheet}>
        <View style={styles.handle} />
        
        <View style={styles.driverInfo}>
          <View style={styles.driverAvatar}>
            <Icon name="person" size={32} color={colors.primary} />
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>Driver Juan</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color={colors.warning} />
              <Text style={styles.ratingText}>4.9</Text>
            </View>
          </View>
          <View style={styles.etaContainer}>
            <Text style={styles.etaValue}>{eta}</Text>
            <Text style={styles.etaLabel}>mins</Text>
          </View>
        </View>

        <View style={styles.deliveryStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {eta > 0 ? 'On the way to your location' : 'Arriving soon'}
          </Text>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.orderInfoLabel}>Order</Text>
          <Text style={styles.orderInfoValue}>WA-2024-001 • 5kg Wash & Dry</Text>
        </View>

        <View style={styles.addressInfo}>
          <Icon name="location" size={20} color={colors.textSecondary} />
          <Text style={styles.addressText}>123 Main Street, Makati City</Text>
        </View>

        <Button
          title="Call Driver"
          variant="secondary"
          icon={<Icon name="call" size={20} color={colors.primary} />}
        />
      </Card>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
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
  mapContainer: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundDark,
    position: 'relative',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
  },
  mapSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  driverMarker: {
    position: 'absolute',
    top: '40%',
    left: '30%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationMarker: {
    position: 'absolute',
    top: '60%',
    right: '30%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.error + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  etaContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  etaValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  etaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deliveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  orderInfo: {
    backgroundColor: colors.backgroundDark,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  orderInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  orderInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addressText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default DeliveryTrackingScreen;
