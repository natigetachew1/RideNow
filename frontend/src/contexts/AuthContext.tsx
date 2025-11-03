import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { authService, type User, handleApiError } from '../services/api';

// Auth Context Types
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'rent' | 'rentee';
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (err) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(email, password);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      localStorage.setItem('token', response.token);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    // Optional: Clear any other user-related storage
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const userData = await authService.getProfile();
      setUser(userData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      // If refresh fails, log user out
      logout();
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    loading,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hooks for specific auth states
export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useAuthLoading = () => {
  const { loading } = useAuth();
  return loading;
};

export const useAuthError = () => {
  const { error, clearError } = useAuth();
  return { error, clearError };
};

export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};

export const useIsRenter = () => {
  const { user } = useAuth();
  return user?.role === 'rent';
};

export const useIsRentee = () => {
  const { user } = useAuth();
  return user?.role === 'rentee';
};

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};

export const useKYCStatus = () => {
  const { user } = useAuth();
  return user?.isKYCVerified || false;
};