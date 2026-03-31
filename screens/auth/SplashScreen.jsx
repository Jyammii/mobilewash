import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';

const SplashScreen = ({ navigation }) => {
  const { isFirstLaunch, setFirstLaunchComplete } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Navigate after 2.5 seconds
    const timer = setTimeout(() => {
      handleNavigation();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = async () => {
    if (isFirstLaunch) {
      await setFirstLaunchComplete();
      navigation.replace('Onboarding');
    } else {
      navigation.replace('Login');
    }
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Animated Washing Machine Icon */}
        <View style={styles.washingMachineContainer}>
          <Animated.View style={[styles.washingMachine, { transform: [{ rotate: spin }] }]}>
            <View style={styles.wmBody}>
              <View style={styles.wmWindow}>
                <Animated.View style={[styles.wmWater, { opacity: fadeAnim }]} />
              </View>
              <View style={styles.wmControls}>
                <View style={styles.wmKnob} />
                <View style={styles.wmKnob} />
              </View>
            </View>
          </Animated.View>
        </View>

        <Text style={styles.appName}>WashAlert</Text>
        <Text style={styles.tagline}>Laundry Made Simple</Text>
      </Animated.View>

      <Animated.Text style={[styles.loadingText, { opacity: fadeAnim }]}>
        Loading...
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  washingMachineContainer: {
    marginBottom: 20,
  },
  washingMachine: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wmBody: {
    width: 80,
    height: 90,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wmWindow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.accent,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wmWater: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '70%',
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
  wmControls: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  wmKnob: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textInverse,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.accentLight,
    letterSpacing: 1,
  },
  loadingText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 14,
    color: colors.textInverse,
  },
});

export default SplashScreen;
