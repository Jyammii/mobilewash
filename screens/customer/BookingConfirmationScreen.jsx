import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from '../../components/Button';

const BookingConfirmationScreen = ({ navigation, route }) => {
  const { booking } = route.params || {};
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const trackingNumber = booking?.trackingNumber || 'WA-2024-001';

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <Icon name="checkmark-circle" size={80} color={colors.success} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your laundry has been booked successfully. Here's your tracking number:
        </Text>

        <View style={styles.trackingBox}>
          <Text style={styles.trackingNumber}>{trackingNumber}</Text>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailRow}>
            <Icon name="location" size={20} color={colors.textSecondary} />
            <Text style={styles.detailText}>{booking?.branch || 'Triplets LaundryHubs'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="water" size={20} color={colors.textSecondary} />
            <Text style={styles.detailText}>{booking?.service || 'Wash & Dry'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="scale" size={20} color={colors.textSecondary} />
            <Text style={styles.detailText}>{booking?.loadSize || '5'} kg</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="wallet" size={20} color={colors.textSecondary} />
            <Text style={styles.detailText}>₱{booking?.totalAmount || '250'}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Button
          title="Track My Order"
          onPress={() => navigation.navigate('Tracking', { orderId: booking?.id })}
          icon={<Icon name="location" size={20} color={colors.textInverse} />}
        />
        <Button
          title="Go to Home"
          variant="secondary"
          onPress={() => navigation.navigate('Home')}
          style={{ marginTop: 12 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  trackingBox: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
  },
  trackingNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textInverse,
    letterSpacing: 2,
  },
  orderDetails: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
});

export default BookingConfirmationScreen;
