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
import { Button } from '../../components/Button';
import { Input } from '../../components/input';
import { BookingProgress } from '../../components/ProgressTracker';
import { apiService } from '../../services/api';

const steps = ['Details', 'Preferences', 'Payment', 'Confirm'];

const BookingScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1: Service Details
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loadSize, setLoadSize] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  
  // Step 2: Preferences
  const [detergents, setDetergents] = useState([]);
  const [selectedDetergent, setSelectedDetergent] = useState(null);
  const [fabricConditioners, setFabricConditioners] = useState([]);
  const [selectedConditioner, setSelectedConditioner] = useState(null);
  const [needsDelivery, setNeedsDelivery] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const deliveryFee = 50;
  
  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState('gcash');
  
  // Booking data
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedService && loadSize) {
      const price = parseFloat(loadSize) * selectedService.pricePerKg;
      setEstimatedPrice(price);
    }
  }, [selectedService, loadSize]);

  const loadInitialData = async () => {
    try {
      const [branchesRes, servicesRes, detergentsRes, conditionersRes] = await Promise.all([
        apiService.getBranches(),
        apiService.getServices(),
        apiService.getDetergents(),
        apiService.getFabricConditioners(),
      ]);
      
      if (branchesRes.success) setBranches(branchesRes.branches);
      if (servicesRes.success) setServices(servicesRes.services);
      if (detergentsRes.success) setDetergents(detergentsRes.detergents);
      if (conditionersRes.success) setFabricConditioners(conditionersRes.fabricConditioners);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const validateStep1 = () => {
    if (!selectedBranch) {
      Alert.alert('Required', 'Please select a branch');
      return false;
    }
    if (!selectedService) {
      Alert.alert('Required', 'Please select a service');
      return false;
    }
    if (!loadSize || parseFloat(loadSize) < 1 || parseFloat(loadSize) > 50) {
      Alert.alert('Invalid', 'Load size must be between 1 and 50 kg');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (needsDelivery && !deliveryAddress.trim()) {
      Alert.alert('Required', 'Please enter delivery address');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleConfirmBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const booking = {
        branchId: selectedBranch.id,
        serviceId: selectedService.id,
        loadSize: parseFloat(loadSize),
        detergentId: selectedDetergent?.id,
        conditionerId: selectedConditioner?.id,
        needsDelivery,
        deliveryAddress: needsDelivery ? deliveryAddress : null,
        specialInstructions,
        paymentMethod,
        totalAmount: estimatedPrice + (needsDelivery ? deliveryFee : 0),
      };
      
      const response = await apiService.createBooking(booking);
      
      if (response.success) {
        setBookingData({
          ...booking,
          trackingNumber: response.trackingNumber || 'WA-2024-' + Math.random().toString().slice(2, 6),
        });
        navigation.navigate('BookingConfirmation', { booking });
      } else {
        Alert.alert('Error', 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      // For demo, navigate to confirmation
      setBookingData({
        branch: selectedBranch.name,
        service: selectedService.name,
        loadSize,
        detergent: selectedDetergent?.name,
        conditioner: selectedConditioner?.name,
        needsDelivery,
        deliveryAddress,
        specialInstructions,
        paymentMethod,
        totalAmount: estimatedPrice + (needsDelivery ? deliveryFee : 0),
        trackingNumber: 'WA-2024-' + Math.floor(Math.random() * 9000 + 1000),
      });
      navigation.navigate('BookingConfirmation', { booking: bookingData });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Branch</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionList}>
        {branches.map(branch => (
          <TouchableOpacity
            key={branch.id}
            style={[
              styles.branchCard,
              selectedBranch?.id === branch.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedBranch(branch)}
          >
            <Icon 
              name="location" 
              size={24} 
              color={selectedBranch?.id === branch.id ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.branchName,
              selectedBranch?.id === branch.id && styles.selectedText,
            ]}>
              {branch.name}
            </Text>
            <Text style={styles.branchAddress}>{branch.address}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.stepTitle}>Select Service</Text>
      <View style={styles.serviceList}>
        {services.map(service => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              selectedService?.id === service.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedService(service)}
          >
            <View style={styles.serviceInfo}>
              <Text style={[
                styles.serviceName,
                selectedService?.id === service.id && styles.selectedText,
              ]}>
                {service.name}
              </Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>
            <Text style={[
              styles.servicePrice,
              selectedService?.id === service.id && styles.selectedText,
            ]}>
              ₱{service.pricePerKg}/kg
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.stepTitle}>Load Size (kg)</Text>
      <Input
        value={loadSize}
        onChangeText={setLoadSize}
        placeholder="Enter weight in kg"
        keyboardType="numeric"
      />
      
      {estimatedPrice > 0 && (
        <Card style={styles.priceCard}>
          <Text style={styles.priceLabel}>Estimated Price</Text>
          <Text style={styles.priceValue}>₱{estimatedPrice}</Text>
        </Card>
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Detergent</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionList}>
        {detergents.map(detergent => (
          <TouchableOpacity
            key={detergent.id}
            style={[
              styles.optionCard,
              selectedDetergent?.id === detergent.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedDetergent(detergent)}
          >
            <Text style={[
              styles.optionName,
              selectedDetergent?.id === detergent.id && styles.selectedText,
            ]}>
              {detergent.name}
            </Text>
            {detergent.price > 0 && (
              <Text style={styles.optionPrice}>+₱{detergent.price}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.stepTitle}>Fabric Conditioner</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionList}>
        {fabricConditioners.map(conditioner => (
          <TouchableOpacity
            key={conditioner.id}
            style={[
              styles.optionCard,
              selectedConditioner?.id === conditioner.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedConditioner(conditioner)}
          >
            <Text style={[
              styles.optionName,
              selectedConditioner?.id === conditioner.id && styles.selectedText,
            ]}>
              {conditioner.name}
            </Text>
            {conditioner.price > 0 && (
              <Text style={styles.optionPrice}>+₱{conditioner.price}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.stepTitle}>Delivery</Text>
      <View style={styles.deliveryToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, !needsDelivery && styles.toggleActive]}
          onPress={() => setNeedsDelivery(false)}
        >
          <Text style={[styles.toggleText, !needsDelivery && styles.toggleTextActive]}>
            Pickup
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, needsDelivery && styles.toggleActive]}
          onPress={() => setNeedsDelivery(true)}
        >
          <Text style={[styles.toggleText, needsDelivery && styles.toggleTextActive]}>
            Delivery (+₱{deliveryFee})
          </Text>
        </TouchableOpacity>
      </View>

      {needsDelivery && (
        <Input
          label="Delivery Address"
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          placeholder="Enter your delivery address"
          multiline
          numberOfLines={3}
        />
      )}

      <Input
        label="Special Instructions (Optional)"
        value={specialInstructions}
        onChangeText={setSpecialInstructions}
        placeholder="Any special handling instructions..."
        multiline
        numberOfLines={3}
        maxLength={200}
      />
      <Text style={styles.charCount}>{specialInstructions.length}/200</Text>
    </View>
  );

  const renderStep3 = () => {
    const totalAmount = estimatedPrice + (needsDelivery ? deliveryFee : 0);
    
    return (
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>Order Summary</Text>
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{selectedService?.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Load Size</Text>
            <Text style={styles.summaryValue}>{loadSize} kg</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Detergent</Text>
            <Text style={styles.summaryValue}>{selectedDetergent?.name || 'Default'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Conditioner</Text>
            <Text style={styles.summaryValue}>{selectedConditioner?.name || 'None'}</Text>
          </View>
          {needsDelivery && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>₱{deliveryFee}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₱{totalAmount}</Text>
          </View>
        </Card>

        <Text style={styles.stepTitle}>Payment Method</Text>
        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === 'gcash' && styles.selectedCard,
          ]}
          onPress={() => setPaymentMethod('gcash')}
        >
          <View style={styles.paymentIcon}>
            <Text style={styles.gcashText}>GCash</Text>
          </View>
          <Text style={styles.paymentText}>Pay with GCash</Text>
          {paymentMethod === 'gcash' && (
            <Icon name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.paymentCard,
            paymentMethod === 'cash' && styles.selectedCard,
          ]}
          onPress={() => setPaymentMethod('cash')}
        >
          <View style={styles.paymentIcon}>
            <Icon name="cash" size={24} color={colors.success} />
          </View>
          <Text style={styles.paymentText}>Pay with Cash</Text>
          {paymentMethod === 'cash' && (
            <Icon name="checkmark-circle" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep4 = () => {
    const totalAmount = estimatedPrice + (needsDelivery ? deliveryFee : 0);
    
    return (
      <View style={styles.stepContent}>
        <View style={styles.confirmHeader}>
          <Icon name="checkmark-circle" size={64} color={colors.success} />
          <Text style={styles.confirmTitle}>Review Your Booking</Text>
        </View>
        
        <Card style={styles.confirmCard}>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Branch</Text>
            <Text style={styles.confirmValue}>{selectedBranch?.name}</Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Service</Text>
            <Text style={styles.confirmValue}>{selectedService?.name}</Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Load Size</Text>
            <Text style={styles.confirmValue}>{loadSize} kg</Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Detergent</Text>
            <Text style={styles.confirmValue}>{selectedDetergent?.name || 'Default'}</Text>
          </View>
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Conditioner</Text>
            <Text style={styles.confirmValue}>{selectedConditioner?.name || 'None'}</Text>
          </View>
          {needsDelivery && (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Delivery Address</Text>
              <Text style={styles.confirmValue}>{deliveryAddress}</Text>
            </View>
          )}
          {specialInstructions && (
            <View style={styles.confirmRow}>
              <Text style={styles.confirmLabel}>Special Instructions</Text>
              <Text style={styles.confirmValue}>{specialInstructions}</Text>
            </View>
          )}
          <View style={styles.confirmRow}>
            <Text style={styles.confirmLabel}>Payment Method</Text>
            <Text style={styles.confirmValue}>{paymentMethod === 'gcash' ? 'GCash' : 'Cash'}</Text>
          </View>
          <View style={[styles.confirmRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₱{totalAmount}</Text>
          </View>
        </Card>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Booking</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <BookingProgress currentStep={currentStep} steps={steps} />
      </View>

      {/* Step Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <Button
            title="Back"
            variant="secondary"
            onPress={handleBack}
            style={styles.backBtn}
          />
        )}
        <Button
          title={currentStep === 4 ? 'Confirm & Book' : 'Next'}
          onPress={handleNext}
          loading={loading}
          style={styles.nextBtn}
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
  progressContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  optionList: {
    marginBottom: 16,
  },
  branchCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    width: 140,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  branchName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
  },
  branchAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  selectedText: {
    color: colors.primary,
  },
  serviceList: {
    gap: 12,
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  serviceDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    minWidth: 100,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  optionPrice: {
    fontSize: 12,
    color: colors.accent,
    marginTop: 4,
  },
  deliveryToggle: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundDark,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.textInverse,
  },
  charCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: -12,
  },
  priceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
  },
  priceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    borderBottomWidth: 0,
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
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
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gcashText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  confirmHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  confirmCard: {
    marginBottom: 20,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  confirmLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  confirmValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
});

export default BookingScreen;
