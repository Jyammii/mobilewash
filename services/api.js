/**
 * WashAlert API Service
 * Base URL: http://localhost:8080/api
 * 
 * All API calls go through this service file.
 * Add Authorization Bearer token header on all authenticated requests.
 * Use dummy data as fallback when API is offline.
 */

const BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('token');
  } catch (error) {
    return null;
  }
};

// Helper for making requests
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'API request failed');
    }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    // Return dummy data for demo purposes
    return getDummyData(endpoint, options.method);
  }
};

// Dummy data fallback based on endpoint
const getDummyData = (endpoint, method) => {
  console.log('Using dummy data for:', endpoint);
  
  if (endpoint.includes('/auth/login')) {
    return { 
      success: true, 
      token: 'dummy-token-12345',
      user: { id: 1, name: 'John Doe', email: 'john@example.com', mobile: '09123456789', role: 'customer' }
    };
  }
  if (endpoint.includes('/auth/register')) {
    return { success: true, message: 'Registration successful' };
  }
  if (endpoint.includes('/bookings')) {
    return { 
      success: true, 
      bookings: [
        { id: 'WA-001', trackingNumber: 'WA-2024-001', status: 'washing', branch: 'Triplets Makati', service: 'Wash & Dry', loadSize: 5, date: '2024-01-15', amount: 250 },
        { id: 'WA-002', trackingNumber: 'WA-2024-002', status: 'ready', branch: 'Triplets UP Diliman', service: 'Dry Clean', loadSize: 2, date: '2024-01-14', amount: 150 },
        { id: 'WA-003', trackingNumber: 'WA-2024-003', status: 'delivered', branch: 'Triplets Pasig', service: 'Wash & Fold', loadSize: 8, date: '2024-01-13', amount: 320 },
      ]
    };
  }
  if (endpoint.includes('/branches')) {
    return {
      success: true,
      branches: [
        { id: 1, name: 'Triplets Makati', address: 'Makati City', status: 'open', phone: '02-8123-4567' },
        { id: 2, name: 'Triplets UP Diliman', address: 'Quezon City', status: 'open', phone: '02-8123-4568' },
        { id: 3, name: 'Triplets JP Rizal', address: 'Marikina City', status: 'open', phone: '02-8123-4569' },
        { id: 4, name: 'Triplets S. Catalina', address: 'Pasig City', status: 'closed', phone: '02-8123-4570' },
        { id: 5, name: 'Triplets Pasig', address: 'Pasig City', status: 'open', phone: '02-8123-4571' },
        { id: 6, name: 'Triplets Republic', address: 'Mandaluyong City', status: 'open', phone: '02-8123-4572' },
        { id: 7, name: 'Triplets Chestnut', address: 'Quezon City', status: 'open', phone: '02-8123-4573' },
        { id: 8, name: 'Triplets T.O.N', address: 'Manila City', status: 'open', phone: '02-8123-4574' },
        { id: 9, name: 'Triplets Samat', address: 'Makati City', status: 'open', phone: '02-8123-4575' },
        { id: 10, name: 'Triplets St. Nino', address: 'Paranaque City', status: 'closed', phone: '02-8123-4576' },
      ]
    };
  }
  if (endpoint.includes('/services')) {
    return {
      success: true,
      services: [
        { id: 1, name: 'Wash & Dry', pricePerKg: 50, description: 'Full wash and dry service' },
        { id: 2, name: 'Wash & Fold', pricePerKg: 40, description: 'Wash and fold service' },
        { id: 3, name: 'Dry Clean', pricePerKg: 75, description: 'Dry cleaning service' },
        { id: 4, name: 'Bleach', pricePerKg: 60, description: 'Wash with bleach' },
      ]
    };
  }
  if (endpoint.includes('/detergents')) {
    return {
      success: true,
      detergents: [
        { id: 1, name: 'Ariel', price: 0, description: 'Regular detergent' },
        { id: 2, name: 'Tide', price: 10, description: 'Premium detergent +₱10' },
        { id: 3, name: 'Sprint', price: 0, description: 'Regular detergent' },
      ]
    };
  }
  if (endpoint.includes('/fabric-conditioners')) {
    return {
      success: true,
      fabricConditioners: [
        { id: 1, name: 'Downy', price: 0, description: 'Regular softener' },
        { id: 2, name: 'Comfort', price: 10, description: 'Premium softener +₱10' },
      ]
    };
  }
  if (endpoint.includes('/notifications')) {
    return {
      success: true,
      notifications: [
        { id: 1, type: 'booking', title: 'Booking Confirmed', message: 'Your booking WA-2024-001 has been confirmed', timestamp: '2024-01-15T10:30:00Z', read: false },
        { id: 2, type: 'status', title: 'Status Update', message: 'Your laundry is now being washed', timestamp: '2024-01-15T11:00:00Z', read: true },
        { id: 3, type: 'delivery', title: 'Driver Assigned', message: 'Driver Juan is on the way', timestamp: '2024-01-15T14:00:00Z', read: false },
      ]
    };
  }
  if (endpoint.includes('/driver/deliveries')) {
    return {
      success: true,
      deliveries: [
        { id: 1, customerName: 'Maria Santos', address: '123 Main St, Makati', orderDetails: 'WA-2024-001 - 5kg Wash & Dry', status: 'assigned', instructions: 'Leave at lobby' },
        { id: 2, customerName: 'Pedro Cruz', address: '456 Oak Ave, Quezon City', orderDetails: 'WA-2024-002 - 3kg Dry Clean', status: 'picked_up', instructions: '' },
      ]
    };
  }
  if (endpoint.includes('/chat')) {
    return {
      success: true,
      response: 'Thank you for your question! Our team will assist you shortly. For immediate help, please call our hotline at 02-8123-4567.'
    };
  }
  
  return { success: false, message: 'Unknown endpoint' };
};

export const apiService = {
  // Auth endpoints
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  forgotPassword: (email) => apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  verifyOTP: (email, otp) => apiRequest('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  }),
  
  resetPassword: (email, newPassword) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, newPassword }),
  }),

  // Booking endpoints
  getBookings: () => apiRequest('/bookings', { method: 'GET' }),
  
  getBookingById: (id) => apiRequest(`/bookings/${id}`, { method: 'GET' }),
  
  createBooking: (bookingData) => apiRequest('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),
  
  updateBookingStatus: (id, status) => apiRequest(`/bookings/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  // Branch endpoints
  getBranches: () => apiRequest('/branches', { method: 'GET' }),
  
  getBranchById: (id) => apiRequest(`/branches/${id}`, { method: 'GET' }),

  // Service endpoints
  getServices: () => apiRequest('/services', { method: 'GET' }),
  
  getDetergents: () => apiRequest('/detergents', { method: 'GET' }),
  
  getFabricConditioners: () => apiRequest('/fabric-conditioners', { method: 'GET' }),

  // Delivery endpoints
  getDriverDeliveries: () => apiRequest('/driver/deliveries', { method: 'GET' }),
  
  updateDeliveryStatus: (id, status) => apiRequest(`/driver/deliveries/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),

  // Notification endpoints
  getNotifications: () => apiRequest('/notifications', { method: 'GET' }),
  
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read`, {
    method: 'PUT',
  }),
  
  markAllNotificationsRead: () => apiRequest('/notifications/read-all', {
    method: 'PUT',
  }),

  // Payment endpoints
  getPaymentHistory: () => apiRequest('/payments/history', { method: 'GET' }),
  
  createPayment: (bookingId, paymentMethod) => apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify({ bookingId, paymentMethod }),
  }),

  // Profile endpoints
  updateProfile: (profileData) => apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),
  
  changePassword: (oldPassword, newPassword) => apiRequest('/profile/change-password', {
    method: 'PUT',
    body: JSON.stringify({ oldPassword, newPassword }),
  }),

  // Chat endpoint
  sendChatMessage: (message) => apiRequest('/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  }),
};

export default apiService;
