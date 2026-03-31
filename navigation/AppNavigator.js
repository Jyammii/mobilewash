import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// Customer Screens
import HomeScreen from '../screens/customer/HomeScreen';
import OrdersScreen from '../screens/customer/OrderScreen';
import OrderDetailScreen from '../screens/customer/OrderDetailScreen';
import BookingScreen from '../screens/customer/BookingScreen';
import BookingConfirmationScreen from '../screens/customer/BookingConfirmationScreen';
import TrackingScreen from '../screens/customer/TrackingScreen';
import DeliveryTrackingScreen from '../screens/customer/DeliveryTrackingScreen';
import PaymentScreen from '../screens/customer/PaymentScreen';
import PaymentHistoryScreen from '../screens/customer/PaymentHistoryScreen';
import PaymentSuccessScreen from '../screens/customer/PaymentSuccessScreen';
import NotificationsScreen from '../screens/customer/NotificationScreen';
import ProfileScreen from '../screens/customer/ProfileScreen';
import EditProfileScreen from '../screens/customer/EditProfileScreen';
import ChatScreen from '../screens/customer/ChatScreen';

// Driver Screens
import DriverDashboardScreen from '../screens/driver/DriverDashboardScreen';
import DriverDeliveriesScreen from '../screens/driver/DriverDeliveriesScreen';
import DeliveryDetailScreen from '../screens/driver/DeliveryDetailScreen';
import DriverNotificationsScreen from '../screens/driver/DriverNotificationScreen';
import DriverProfileScreen from '../screens/driver/DriverProfileScreen';

// Auth Context
import { useAuth } from '../context/AuthContext';

// Stack Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Temporary aliases for screens not yet implemented as separate files.
const OnboardingScreen = SplashScreen;
const LoginScreen = RegisterScreen;
const OTPVerificationScreen = ResetPasswordScreen;

// Custom Tab Bar Icon
const TabIcon = ({ name, focused, badge }) => (
  <View style={styles.tabIconContainer}>
    <Icon 
      name={name} 
      size={focused ? 26 : 24} 
      color={focused ? colors.primary : colors.tabBarInactive} 
    />
    {badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
      </View>
    )}
  </View>
);

// Auth Stack Navigator
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

// Customer Bottom Tabs
const CustomerTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.tabBarInactive,
      tabBarLabelStyle: styles.tabBarLabel,
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Orders"
      component={OrdersScreen}
      options={{
        tabBarLabel: 'Orders',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'list' : 'list-outline'} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="Book"
      component={BookingScreen}
      options={{
        tabBarLabel: 'Book',
        tabBarIcon: ({ focused }) => (
          <View style={styles.bookTab}>
            <Icon name="add" size={28} color={colors.textInverse} />
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        tabBarLabel: 'Alerts',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'notifications' : 'notifications-outline'} focused={focused} badge={2} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// Driver Bottom Tabs
const DriverTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.tabBarInactive,
      tabBarLabelStyle: styles.tabBarLabel,
    }}
  >
    <Tab.Screen
      name="DriverDashboard"
      component={DriverDashboardScreen}
      options={{
        tabBarLabel: 'Dashboard',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'grid' : 'grid-outline'} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="DriverDeliveries"
      component={DriverDeliveriesScreen}
      options={{
        tabBarLabel: 'Deliveries',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'car' : 'car-outline'} focused={focused} />,
      }}
    />
    <Tab.Screen
      name="DriverNotifications"
      component={DriverNotificationsScreen}
      options={{
        tabBarLabel: 'Alerts',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'notifications' : 'notifications-outline'} focused={focused} badge={1} />,
      }}
    />
    <Tab.Screen
      name="DriverProfile"
      component={DriverProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ focused }) => <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />,
      }}
    />
  </Tab.Navigator>
);

// Customer Stack Navigator
const CustomerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    <Stack.Screen name="Tracking" component={TrackingScreen} />
    <Stack.Screen name="DeliveryTracking" component={DeliveryTrackingScreen} />
    <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
    <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
  </Stack.Navigator>
);

// Driver Stack Navigator
const DriverStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DriverTabs" component={DriverTabs} />
    <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { user, role, loading, isFirstLaunch } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading app...</Text>
      </View>
    );
  }

  const rootScreen = !user
    ? <Stack.Screen name="AuthStack" component={AuthStack} />
    : role === 'driver'
      ? <Stack.Screen name="DriverStack" component={DriverStack} />
      : <Stack.Screen name="CustomerStack" component={CustomerStack} />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {rootScreen}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  tabIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.textInverse,
    fontSize: 10,
    fontWeight: '700',
  },
  bookTab: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default AppNavigator;
