import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: 'receipt-outline', label: 'Booking History', key: 'bookingHistory' },
  { icon: 'wallet-outline', label: 'Payment History', key: 'paymentHistory' },
  { icon: 'notifications-outline', label: 'Notifications Settings', key: 'notifications' },
  { icon: 'document-text-outline', label: 'Terms and Conditions', key: 'terms' },
  { icon: 'shield-checkmark-outline', label: 'Privacy Policy', key: 'privacy' },
  { icon: 'help-circle-outline', label: 'Help and Support', key: 'help' },
  { icon: 'log-out-outline', label: 'Logout', key: 'logout', danger: true },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleMenuPress = async (key) => {
    switch (key) {
      case 'bookingHistory':
        navigation.navigate('Orders');
        break;
      case 'paymentHistory':
        navigation.navigate('PaymentHistory');
        break;
      case 'notifications':
        navigation.navigate('Notifications');
        break;
      case 'terms':
        Alert.alert('Terms', 'Terms and Conditions content would be displayed here.');
        break;
      case 'privacy':
        Alert.alert('Privacy', 'Privacy Policy content would be displayed here.');
        break;
      case 'help':
        navigation.navigate('Chat');
        break;
      case 'logout':
        Alert.alert(
          'Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Logout', 
              style: 'destructive',
              onPress: async () => {
                await logout();
              }
            },
          ]
        );
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color={colors.primary} />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera" size={16} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'John Doe'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'john@example.com'}</Text>
          <Text style={styles.userMobile}>{user?.mobile || '09123456789'}</Text>

          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="create-outline" size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </Card>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem,
              ]}
              onPress={() => handleMenuPress(item.key)}
            >
              <View style={styles.menuLeft}>
                <View style={[
                  styles.menuIcon, 
                  item.danger && styles.menuIconDanger
                ]}>
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={item.danger ? colors.error : colors.primary} 
                  />
                </View>
                <Text style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}>
                  {item.label}
                </Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <Text style={styles.version}>WashAlert v1.0.0</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  userMobile: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {
    backgroundColor: colors.error + '15',
  },
  menuLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  menuLabelDanger: {
    color: colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 24,
    marginBottom: 40,
  },
});

export default ProfileScreen;
