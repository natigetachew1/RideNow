import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'rent' | 'rentee';
  balance: number;
  subscriptionStatus: boolean;
  isKYCVerified: boolean;
  idType?: string;
  idNumber?: string;
  licensePhoto?: string;
  livePhoto?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  _id: string;
  vehicleType: 'scooter' | 'bike';
  model: string;
  serialNumber: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'forRent' | 'forDelivery' | 'available' | 'inUse' | 'maintenance';
  pricePerHour: number;
  lastMaintenance?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  _id: string;
  userId: string;
  vehicleId: string;
  startTime: string;
  endTime?: string;
  startLocation: {
    lat: number;
    lng: number;
  };
  endLocation?: {
    lat: number;
    lng: number;
  };
  status: 'ongoing' | 'completed' | 'cancelled';
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  userId: string;
  tripId?: string;
  amount: number;
  method: 'chapa';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ad {
  _id: string;
  userId: string;
  vehicleId?: string;
  price: number;
  status: 'active' | 'inactive';
  businessType: 'rent' | 'deliveryy';
  starReview: number;
  isNegotiable: boolean;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  _id: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'rent' | 'rentee';
}

export interface NearbyVehiclesParams {
  latitude: number;
  longitude: number;
  radius?: number;
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: RegisterData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/profile', updates);
    return response.data;
  },

  verifyKYC: async (kycData: {
    idType: string;
    idNumber: string;
    licensePhoto: string;
    livePhoto: string;
  }): Promise<User> => {
    const response = await api.post<User>('/auth/verify-kyc', kycData);
    return response.data;
  },
};

// Vehicle Services
export const vehicleService = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  },

  getNearby: async (params: NearbyVehiclesParams): Promise<Vehicle[]> => {
    const response = await api.post<Vehicle[]>('/vehicles/nearby', params);
    return response.data;
  },

  getById: async (id: string): Promise<Vehicle> => {
    const response = await api.get<Vehicle>(`/vehicles/${id}`);
    return response.data;
  },

  create: async (vehicleData: Omit<Vehicle, '_id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> => {
    const response = await api.post<Vehicle>('/vehicles', vehicleData);
    return response.data;
  },

  update: async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.put<Vehicle>(`/vehicles/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/vehicles/${id}`);
    return response.data;
  },

  updateLocation: async (id: string, location: { lat: number; lng: number }): Promise<Vehicle> => {
    const response = await api.patch<Vehicle>(`/vehicles/${id}/location`, location);
    return response.data;
  },
};

// Trip Services
export const tripService = {
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get<Trip[]>('/trips');
    return response.data;
  },

  getMyTrips: async (): Promise<Trip[]> => {
    const response = await api.get<Trip[]>('/trips/my-trips');
    return response.data;
  },

  getById: async (id: string): Promise<Trip> => {
    const response = await api.get<Trip>(`/trips/${id}`);
    return response.data;
  },

  create: async (tripData: {
    vehicleId: string;
    startTime: string;
    startLocation: { lat: number; lng: number };
  }): Promise<Trip> => {
    const response = await api.post<Trip>('/trips', tripData);
    return response.data;
  },

  update: async (id: string, updates: Partial<Trip>): Promise<Trip> => {
    const response = await api.put<Trip>(`/trips/${id}`, updates);
    return response.data;
  },

  endTrip: async (id: string, endData: {
    endTime: string;
    endLocation: { lat: number; lng: number };
  }): Promise<Trip> => {
    const response = await api.put<Trip>(`/trips/${id}`, { ...endData, status: 'completed' });
    return response.data;
  },

  cancelTrip: async (id: string): Promise<Trip> => {
    const response = await api.put<Trip>(`/trips/${id}`, { status: 'cancelled' });
    return response.data;
  },
};

// Payment Services
export const paymentService = {
  createPayment: async (paymentData: {
    amount: number;
    method: 'chapa';
    tripId?: string;
  }): Promise<Payment> => {
    const response = await api.post<Payment>('/payments', paymentData);
    return response.data;
  },

  verifyPayment: async (txRef: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/payments/verify/${txRef}`);
    return response.data;
  },

  getMyPayments: async (): Promise<Payment[]> => {
    const response = await api.get<Payment[]>('/payments/my-payments');
    return response.data;
  },

  processChapaPayment: async (paymentData: {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<{ checkout_url: string; tx_ref: string }> => {
    const response = await api.post<{ checkout_url: string; tx_ref: string }>('/payments/chapa', paymentData);
    return response.data;
  },
};

// Ad Services
export const adService = {
  getAll: async (): Promise<Ad[]> => {
    const response = await api.get<Ad[]>('/ads');
    return response.data;
  },

  getById: async (id: string): Promise<Ad> => {
    const response = await api.get<Ad>(`/ads/${id}`);
    return response.data;
  },

  create: async (adData: Omit<Ad, '_id' | 'createdAt' | 'updatedAt'>): Promise<Ad> => {
    const response = await api.post<Ad>('/ads', adData);
    return response.data;
  },

  update: async (id: string, updates: Partial<Ad>): Promise<Ad> => {
    const response = await api.put<Ad>(`/ads/${id}`, updates);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/ads/${id}`);
    return response.data;
  },

  getByStatus: async (status: 'active' | 'inactive'): Promise<Ad[]> => {
    const response = await api.get<Ad[]>(`/ads/status/${status}`);
    return response.data;
  },

  getByBusinessType: async (type: 'rent' | 'deliveryy'): Promise<Ad[]> => {
    const response = await api.get<Ad[]>(`/ads/type/${type}`);
    return response.data;
  },
};

// Notification Services
export const notificationService = {
  getMyNotifications: async (): Promise<Notification[]> => {
    const response = await api.get<Notification[]>('/notifications/my-notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.patch<{ message: string }>('/notifications/mark-all-read');
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/notifications/${id}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>('/notifications/unread-count');
    return response.data;
  },
};

// Location Services
export const locationService = {
  addLocation: async (location: { lat: number; lng: number }): Promise<Location> => {
    const response = await api.post<Location>('/locations', location);
    return response.data;
  },

  getAllLocations: async (): Promise<Location[]> => {
    const response = await api.get<Location[]>('/locations');
    return response.data;
  },

  getNearbyLocations: async (params: NearbyVehiclesParams): Promise<Location[]> => {
    const response = await api.post<Location[]>('/locations/nearby', params);
    return response.data;
  },
};

// User Management Services (Admin)
export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/admin/users/${id}`, updates);
    return response.data;
  },

  deleteUser: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/admin/users/${id}`);
    return response.data;
  },
};

// Subscription Services
export const subscriptionService = {
  getPlans: async (): Promise<any[]> => {
    const response = await api.get<any[]>('/subscription/plans');
    return response.data;
  },

  subscribe: async (planId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/subscription/subscribe', { planId });
    return response.data;
  },

  cancelSubscription: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/subscription/cancel');
    return response.data;
  },

  getCurrentSubscription: async (): Promise<any> => {
    const response = await api.get<any>('/subscription/current');
    return response.data;
  },
};

// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

// Utility function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Utility function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default api;