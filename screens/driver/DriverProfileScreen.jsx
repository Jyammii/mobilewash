import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: 'person-outline', label: 'My Profile', key: 'profile' },
  { icon: 'car-outline', label: 'Vehicle Info', key: 'vehicle' },
  { icon: 'notifications-outline', label: 'Notifications Settings', key: 'notifications' },
  { icon: 'help-circle-outline', label: 'Help and Support', key: 'help' },
  { icon: 'log-out-outline', label: 'Logout', key: 'logout', danger: true },
];

const DriverProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const handleMenuPress = async (key) => {
    if (key === 'logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => { await logout(); } },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{user?.name || 'Driver Juan'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'driver@washalert.com'}</Text>
          <View style={styles.statusBadge}>
            <Icon name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </Card>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={item.key} style={[styles.menuItem, index === menuItems.length - 1 && styles.lastMenuItem]} onPress={() => handleMenuPress(item.key)}>
              <View style={styles.menuLeft}>
                <View style={[styles.menuIcon, item.danger && styles.menuIconDanger]}>
                  <Icon name={item.icon} size={20} color={item.danger ? colors.error : colors.primary} />
                </View>
                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>{item.label}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.version}>WashAlert Driver v1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: colors.surface },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  profileCard: { marginHorizontal: 20, marginBottom: 24, alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  userName: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  userEmail: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: colors.success + '20', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  statusText: { color: colors.success, fontWeight: '500', fontSize: 14 },
  menuContainer: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  lastMenuItem: { borderBottomWidth: 0 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  menuIconDanger: { backgroundColor: colors.error + '15' },
  menuLabel: { fontSize: 16, color: colors.textPrimary },
  menuLabelDanger: { color: colors.error },
  version: { textAlign: 'center', fontSize: 12, color: colors.textTertiary, marginTop: 24, marginBottom: 40 },
});

export default DriverProfileScreen;
