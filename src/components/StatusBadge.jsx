import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const statusConfig = {
  // Order statuses
  received: { backgroundColor: colors.statusReceived, label: 'Received' },
  washing: { backgroundColor: colors.statusWashing, label: 'Washing' },
  drying: { backgroundColor: colors.statusDrying, label: 'Drying' },
  ready: { backgroundColor: colors.statusReady, label: 'Ready' },
  delivered: { backgroundColor: colors.statusDelivered, label: 'Delivered' },
  cancelled: { backgroundColor: colors.statusCancelled, label: 'Cancelled' },
  pending: { backgroundColor: colors.warning, label: 'Pending' },
  processing: { backgroundColor: colors.info, label: 'Processing' },
  
  // Payment statuses
  paid: { backgroundColor: colors.success, label: 'Paid' },
  failed: { backgroundColor: colors.error, label: 'Failed' },
  
  // Branch statuses
  open: { backgroundColor: colors.success, label: 'Open' },
  closed: { backgroundColor: colors.error, label: 'Closed' },
};

export const StatusBadge = ({ 
  status, 
  size = 'medium',
  customLabel,
  style,
}) => {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  
  return (
    <View style={[
      styles.badge, 
      { backgroundColor: config.backgroundColor },
      styles[size],
      style
    ]}>
      <Text style={[styles.text, styles[`${size}Text`]]}>
        {customLabel || config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    color: colors.textInverse,
    fontWeight: '600',
  },
  // Sizes
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  large: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});

export default StatusBadge;
