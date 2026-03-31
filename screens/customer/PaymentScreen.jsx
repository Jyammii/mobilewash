import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { apiService } from '../../services/api';

const PaymentScreen = ({ navigation, route }) => {
  const { booking } = route.params || {};
  const [selectedMethod, setSelectedMethod] = useState('gcash');
  const [loading, setLoading] = useState(false);

  const amount = booking?.totalAmount || 250;

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (selectedMethod === 'gcash') {
        // Simulate GCash payment redirect
        await new Promise(resolve => setTimeout(resolve, 2000));
        Alert.alert(
          'Payment Initiated',
          'You will be redirected to GCash to complete your payment.',
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('PaymentSuccess', { amount }),
            },
          ]
        );
      } else {
        // Cash payment
        navigation.navigate('PaymentSuccess', { amount, method: 'cash' });
      }
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        {/* Order Summary */}
        <Card style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{booking?.service || 'Wash & Dry'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Load Size</Text>
            <Text style={styles.summaryValue}>{booking?.loadSize || '5'} kg</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Branch</Text>
            <Text style={styles.summaryValue}>{booking?.branch || 'Triplets Makati'}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₱{amount}</Text>
          </View>
        </Card>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === 'gcash' && styles.selectedCard,
          ]}
          onPress={() => setSelectedMethod('gcash')}
        >
          <View style={styles.paymentOption}>
            <View style={[styles.paymentIcon, { backgroundColor: colors.primary + '20' }]}>
              <Text style={styles.gcashText}>G</Text>
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>GCash</Text>
              <Text style={styles.paymentDescription}>Pay instantly with GCash</Text>
            </View>
          </View>
          {selectedMethod === 'gcash' && (
            <Icon name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === 'cash' && styles.selectedCard,
          ]}
          onPress={() => setSelectedMethod('cash')}
        >
          <View style={styles.paymentOption}>
            <View style={[styles.paymentIcon, { backgroundColor: colors.success + '20' }]}>
              <Icon name="cash" size={24} color={colors.success} />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>Cash</Text>
              <Text style={styles.paymentDescription}>Pay when you pick up</Text>
            </View>
          </View>
          {selectedMethod === 'cash' && (
            <Icon name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>

        {selectedMethod === 'gcash' && (
          <View style={styles.notice}>
            <Icon name="information-circle" size={20} color={colors.info} />
            <Text style={styles.noticeText}>
              You will be redirected to GCash to complete your payment securely.
            </Text>
          </View>
        )}
      </View>

      {/* Pay Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={`Pay ₱${amount}`}
          onPress={handlePayment}
          loading={loading}
          icon={<Icon name="wallet" size={20} color={colors.textInverse} />}
        />
      </View>
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
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gcashText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  paymentDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.info + '15',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: colors.info,
    lineHeight: 18,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default PaymentScreen;
