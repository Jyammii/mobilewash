import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { apiService } from '../../services/api';

const getNotificationIcon = (type) => {
  const icons = {
    delivery: 'car',
    order: 'receipt',
    system: 'settings',
  };
  return icons[type] || 'notifications';
};

const DriverNotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'delivery', title: 'New Delivery Assigned', message: 'You have a new delivery for Maria Santos', timestamp: new Date(), read: false },
    { id: 2, type: 'system', title: 'Shift Started', message: 'Your shift has started. Check your deliveries.', timestamp: new Date(Date.now() - 3600000), read: true },
  ]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <View style={styles.iconContainer}>
        <Icon name={getNotificationIcon(item.type)} size={24} color={colors.primary} />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadText]}>{item.title}</Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{formatTime(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, backgroundColor: colors.surface },
  headerTitle: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  listContent: { padding: 16 },
  notificationCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, flexDirection: 'row', marginBottom: 12, gap: 12 },
  unreadCard: { backgroundColor: colors.primary + '08' },
  iconContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center' },
  notificationContent: { flex: 1 },
  notificationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notificationTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  unreadText: { fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  notificationMessage: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  notificationTime: { fontSize: 12, color: colors.textTertiary, marginTop: 8 },
});

export default DriverNotificationsScreen;
