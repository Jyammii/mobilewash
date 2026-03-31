import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const steps = [
  { key: 'received', label: 'Order Received', icon: 'checkmark-circle' },
  { key: 'washing', label: 'Washing', icon: 'water' },
  { key: 'drying', label: 'Drying', icon: 'sunny' },
  { key: 'ready', label: 'Ready for Pickup', icon: 'checkmark-done-circle' },
  { key: 'delivered', label: 'Delivered', icon: 'car' },
];

export const ProgressTracker = ({ 
  currentStep = 0, 
  showLabels = true,
  animated = true,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated && currentStep > 0 && currentStep < steps.length - 1) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [currentStep]);

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          
          return (
            <View key={step.key} style={styles.stepWrapper}>
              <View style={styles.stepContainer}>
                <Animated.View
                  style={[
                    styles.iconContainer,
                    status === 'completed' && styles.completedIcon,
                    status === 'current' && styles.currentIcon,
                    status === 'current' && animated && { transform: [{ scale: pulseAnim }] },
                  ]}
                >
                  <Icon
                    name={status === 'pending' ? 'ellipse' : step.icon}
                    size={status === 'pending' ? 16 : 24}
                    color={status === 'pending' ? colors.textTertiary : colors.textInverse}
                  />
                </Animated.View>
                
                {!isLast && (
                  <View style={[
                    styles.connector,
                    index < currentStep && styles.connectorCompleted,
                  ]} />
                )}
              </View>
              
              {showLabels && (
                <Text style={[
                  styles.label,
                  status === 'completed' && styles.labelCompleted,
                  status === 'current' && styles.labelCurrent,
                ]}>
                  {step.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Booking Progress Steps
export const BookingProgress = ({ currentStep = 1, steps = [], style }) => {
  return (
    <View style={[styles.bookingContainer, style]}>
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const status = stepNum < currentStep ? 'completed' : stepNum === currentStep ? 'current' : 'pending';
        
        return (
          <View key={index} style={styles.bookingStep}>
            <View style={[
              styles.bookingStepCircle,
              status === 'completed' && styles.bookingStepCompleted,
              status === 'current' && styles.bookingStepCurrent,
            ]}>
              <Text style={[
                styles.bookingStepNumber,
                status === 'completed' && styles.bookingStepNumberCompleted,
                status === 'current' && styles.bookingStepNumberCurrent,
              ]}>
                {status === 'completed' ? '✓' : stepNum}
              </Text>
            </View>
            <Text style={[
              styles.bookingStepLabel,
              status === 'completed' && styles.bookingStepLabelCompleted,
              status === 'current' && styles.bookingStepLabelCurrent,
            ]}>
              {step}
            </Text>
            {stepNum < steps.length && (
              <View style={[
                styles.bookingStepLine,
                status === 'completed' && styles.bookingStepLineCompleted,
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  completedIcon: {
    backgroundColor: colors.success,
  },
  currentIcon: {
    backgroundColor: colors.primary,
  },
  connector: {
    position: 'absolute',
    left: '50%',
    right: '-50%',
    height: 3,
    backgroundColor: colors.border,
    top: 17,
  },
  connectorCompleted: {
    backgroundColor: colors.success,
  },
  label: {
    marginTop: 8,
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
  },
  labelCompleted: {
    color: colors.success,
  },
  labelCurrent: {
    color: colors.primary,
    fontWeight: '600',
  },
  // Booking Progress Styles
  bookingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bookingStep: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookingStepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingStepCompleted: {
    backgroundColor: colors.success,
  },
  bookingStepCurrent: {
    backgroundColor: colors.primary,
  },
  bookingStepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  bookingStepNumberCompleted: {
    color: colors.textInverse,
  },
  bookingStepNumberCurrent: {
    color: colors.textInverse,
  },
  bookingStepLabel: {
    marginLeft: 6,
    fontSize: 11,
    color: colors.textTertiary,
  },
  bookingStepLabelCompleted: {
    color: colors.success,
  },
  bookingStepLabelCurrent: {
    color: colors.primary,
    fontWeight: '600',
  },
  bookingStepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  bookingStepLineCompleted: {
    backgroundColor: colors.success,
  },
});

export default ProgressTracker;
