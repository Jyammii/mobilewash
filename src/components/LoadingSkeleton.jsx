import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { colors } from '../../theme/colors';

// Washing Machine Loading Component
export const WashingMachineLoading = ({ size = 'medium', text = 'Loading...' }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const waterValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin animation for the drum
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Pulse animation for the center
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 0.7,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Water wave animation
    const waterAnimation = Animated.loop(
      Animated.timing(waterValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    spinAnimation.start();
    pulseAnimation.start();
    waterAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
      waterAnimation.stop();
    };
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sizes = {
    small: { width: 40, height: 40, borderWidth: 3 },
    medium: { width: 60, height: 60, borderWidth: 4 },
    large: { width: 80, height: 80, borderWidth: 5 },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <View style={styles.container}>
      <View style={styles.machineOuter}>
        <Animated.View
          style={[
            styles.machineInner,
            currentSize,
            { transform: [{ rotate: spin }] },
          ]}
        >
          {/* Drum Window */}
          <View style={[styles.drumWindow, { borderWidth: currentSize.borderWidth - 1 }]}>
            {/* Water Effect */}
            <Animated.View
              style={[
                styles.water,
                {
                  transform: [
                    {
                      translateY: waterValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, -10],
                      }),
                    },
                  ],
                  opacity: waterValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 0.7, 0.3],
                  }),
                },
              ]}
            />
            {/* Drum Center */}
            <Animated.View
              style={[
                styles.drumCenter,
                {
                  transform: [{ scale: pulseValue }],
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>
      <View style={styles.machineBase} />
      {text && <View style={styles.textContainer}><Animated.Text style={styles.text}>{text}</Animated.Text></View>}
    </View>
  );
};

// Skeleton Placeholder Component
export const LoadingSkeleton = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 8,
  style,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton Card for loading states
export const SkeletonCard = ({ style }) => (
  <View style={[styles.skeletonCard, style]}>
    <LoadingSkeleton width={60} height={60} borderRadius={12} />
    <View style={styles.skeletonContent}>
      <LoadingSkeleton width="70%" height={16} />
      <LoadingSkeleton width="50%" height={12} style={{ marginTop: 8 }} />
    </View>
  </View>
);

// Skeleton List
export const SkeletonList = ({ count = 3, style }) => (
  <View style={style}>
    {[...Array(count)].map((_, index) => (
      <SkeletonCard key={index} style={{ marginBottom: 12 }} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  // Washing Machine Styles
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  machineOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  machineInner: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundDark,
  },
  drumWindow: {
    width: '70%',
    height: '70%',
    borderRadius: 100,
    borderColor: colors.primaryLight,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  water: {
    position: 'absolute',
    width: '100%',
    height: '60%',
    backgroundColor: colors.accent,
    borderRadius: 50,
    bottom: 0,
  },
  drumCenter: {
    width: '40%',
    height: '40%',
    borderRadius: 100,
    backgroundColor: colors.primary,
  },
  machineBase: {
    width: '60%',
    height: 8,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: 2,
  },
  textContainer: {
    marginTop: 16,
  },
  text: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  // Skeleton Styles
  skeleton: {
    backgroundColor: colors.skeleton,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default WashingMachineLoading;
