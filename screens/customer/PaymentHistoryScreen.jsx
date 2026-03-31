import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Card } from '../../components/Card';
import { StatusBadge } from '../../components/StatusBadge';
import { EmptyState } from '../../components/EmptyState';
import { apiService } from '../../services/api';

const PaymentHistoryScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await apiService.getPaymentHistory();
      if (response.success) {
        setPayments(response.payments || []);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentCard = ({ item }) => (
    <Card style={styles.paymentCard}>
      <View style={styles.paymentHeader}>
        <View>
          <Text style={styles.paymentDate}>{item.date}</Text>
          <Text style={styles.paymentRef}>Ref: {item.reference}</Text>
        </View>
        <StatusBadge status={item.status === 'Paid' ? 'paid' : item.status.toLowerCase()} />
      </View>
      <View style={styles.paymentDetails}>
        <Text style={styles.paymentAmount}>₱{item.amount}</Text>
        <View style={styles.methodBadge}>
          <Icon 
            name={item.method === 'GCash' ? 'wallet' : 'cash'} 
            size={16} 
            color={colors.textSecondary} 
          />
          <Text style={styles.methodText}>{item.method}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={styles.headerRight} />
      </View>

      {payments.length === 0 ? (
        <EmptyState
          icon="wallet-outline"
          title="No Payments"
          message="Your payment history will appear here."
        />
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  listContent: {
    padding: 20,
  },
  paymentCard: {
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  paymentDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  paymentRef: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  methodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.backgroundDark,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  methodText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default PaymentHistoryScreen;
