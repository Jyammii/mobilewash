import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Card from '../../components/Card';
import ProgressTracker from '../../components/ProgressTracker';

const BookingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    branch: '',
    service: '',
    loadSize: '5',
    detergent: 'standard',
    conditioner: 'none',
    delivery: false,
    deliveryAddress: '',
    instructions: '',
    paymentMethod: 'gcash',
  });

  const steps = ['Details', 'Preferences', 'Payment', 'Confirm'];

  const services = [
    { id: '1', name: 'Basic Wash', price: 80 },
    { id: '2', name: 'Wash & Dry', price: 150 },
    { id: '3', name: 'Premium Wash', price: 200 },
  ];

  const branches = [
    { id: '1', name: 'Makati Branch' },
    { id: '2', name: 'BGC Branch' },
  ];

  const calculatePrice = () => {
    const service = services.find(s => s.id === bookingData.service);
    return service?.price || 0;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text style={styles.stepTitle}>Service Details</Text>
            <Text style={styles.label}>Select Branch</Text>
            {branches.map(b => (
              <TouchableOpacity
                key={b.id}
                style={[styles.option, bookingData.branch === b.id && styles.optionActive]}
                onPress={() => setBookingData({...bookingData, branch: b.id})}
              >
                <Text style={styles.optionText}>{b.name}</Text>
              </TouchableOpacity>
            ))}
            <Text style={styles.label}>Select Service</Text>
            {services.map(s => (
              <Card
                key={s.id}
                onPress={() => setBookingData({...bookingData, service: s.id})}
              >
                <View style={styles.serviceRow}>
                  <View>
                    <Text style={styles.serviceName}>{s.name}</Text>
                  </View>
                  <Text style={styles.servicePrice}>₱{s.price}</Text>
                </View>
              </Card>
            ))}
            <Input
              label="Load Size (kg)"
              value={bookingData.loadSize}
              onChangeText={(t) => setBookingData({...bookingData, loadSize: t})}
              keyboardType="number-pad"
            />
            <Button title="Next" onPress={() => setCurrentStep(1)} variant="primary" fullWidth style={{marginTop: 20}} />
          </View>
        );
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Preferences</Text>
            <Card onPress={() => setBookingData({...bookingData, delivery: !bookingData.delivery})}>
              <View style={styles.deliveryRow}>
                <Text style={styles.deliveryLabel}>Add Delivery?</Text>
                <MaterialCommunityIcons
                  name={bookingData.delivery ? 'check-circle' : 'circle-outline'}
                  size={24}
                  color={colors.primary}
                />
              </View>
            </Card>
            {bookingData.delivery && (
              <Input
                label="Delivery Address"
                value={bookingData.deliveryAddress}
                onChangeText={(t) => setBookingData({...bookingData, deliveryAddress: t})}
              />
            )}
            <View style={styles.buttonRow}>
              <Button title="Back" onPress={() => setCurrentStep(0)} variant="outline" style={{flex: 1, marginRight: 10}} />
              <Button title="Next" onPress={() => setCurrentStep(2)} variant="primary" style={{flex: 1}} />
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Payment Method</Text>
            <Card onPress={() => setBookingData({...bookingData, paymentMethod: 'gcash'})}>
              <View style={styles.paymentRow}>
                <MaterialCommunityIcons name="credit-card" size={24} color={colors.accent} />
                <Text style={styles.paymentText}>GCash</Text>
              </View>
            </Card>
            <Card onPress={() => setBookingData({...bookingData, paymentMethod: 'cash'})}>
              <View style={styles.paymentRow}>
                <MaterialCommunityIcons name="cash" size={24} color={colors.success} />
                <Text style={styles.paymentText}>Cash on Delivery</Text>
              </View>
            </Card>
            <View style={styles.buttonRow}>
              <Button title="Back" onPress={() => setCurrentStep(1)} variant="outline" style={{flex: 1, marginRight: 10}} />
              <Button title="Next" onPress={() => setCurrentStep(3)} variant="primary" style={{flex: 1}} />
            </View>
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Confirm Booking</Text>
            <Card variant="elevated">
              <Text style={styles.summaryLabel}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Service:</Text>
                <Text style={styles.summaryValue}>{services.find(s => s.id === bookingData.service)?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Total:</Text>
                <Text style={[styles.summaryValue, styles.totalPrice]}>₱{calculatePrice()}</Text>
              </View>
            </Card>
            <View style={styles.buttonRow}>
              <Button title="Back" onPress={() => setCurrentStep(2)} variant="outline" style={{flex: 1, marginRight: 10}} />
              <Button title="Confirm & Book" onPress={() => navigation.navigate('BookingConfirmation')} variant="primary" style={{flex: 1}} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>New Booking</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      <ProgressTracker steps={steps} currentStep={currentStep} />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {renderStep()}
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
    paddingVertical: 16,
  },
  title: {
    ...typography.heading2,
    color: colors.text.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepTitle: {
    ...typography.heading3,
    color: colors.text.primary,
    marginBottom: 16,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: 12,
  },
  option: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionText: {
    ...typography.body2,
    color: colors.text.primary,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  servicePrice: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '700',
  },
  deliveryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryLabel: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentText: {
    ...typography.body1,
    color: colors.text.primary,
    marginLeft: 12,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: 12,
  },
  summaryKey: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  summaryValue: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: '600',
  },
  totalPrice: {
    ...typography.heading3,
    color: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 40,
  },
});

export default BookingScreen;
