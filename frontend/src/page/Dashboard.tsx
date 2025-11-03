import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { tripService, vehicleService, paymentService } from '../services/api';
import { Car, Map, DollarSign, Bike, User, Shield, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalTrips: number;
  activeTrips: number;
  totalEarnings: number;
  availableVehicles: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTrips: 0,
    activeTrips: 0,
    totalEarnings: 0,
    availableVehicles: 0
  });
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [trips, vehicles, payments] = await Promise.all([
          tripService.getMyTrips(),
          vehicleService.getAll(),
          user?.role === 'rent' ? paymentService.getMyPayments() : Promise.resolve([])
        ]);

        // Calculate stats
        const totalTrips = trips.length;
        const activeTrips = trips.filter(trip => trip.status === 'ongoing').length;
        const availableVehicles = vehicles.filter(vehicle => 
          vehicle.status === 'forRent' || vehicle.status === 'available'
        ).length;
        
        // Calculate earnings from completed trips
        const totalEarnings = trips
          .filter(trip => trip.status === 'completed' && trip.totalAmount)
          .reduce((sum, trip) => sum + (trip.totalAmount || 0), 0);

        setStats({
          totalTrips,
          activeTrips,
          totalEarnings,
          availableVehicles
        });

        // Set recent trips (last 3)
        setRecentTrips(trips.slice(0, 3));

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role]);

  const statsCards = [
    {
      icon: <Car className="h-6 w-6" />,
      label: 'Total Trips',
      value: stats.totalTrips.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'All time trips'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      label: 'Active Trips',
      value: stats.activeTrips.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Currently ongoing'
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      label: 'Total Earnings',
      value: `${stats.totalEarnings.toLocaleString()} ETB`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Lifetime earnings'
    },
    {
      icon: <Bike className="h-6 w-6" />,
      label: 'Available Vehicles',
      value: stats.availableVehicles.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Near you'
    }
  ];

  const quickActions = [
    {
      title: 'Find Vehicles',
      description: 'Rent bikes and scooters nearby',
      icon: <Map className="h-8 w-8" />,
      path: '/map',
      color: 'bg-blue-500 hover:bg-blue-600',
      available: true
    },
    {
      title: 'My Vehicles',
      description: 'Manage your bike listings',
      icon: <Bike className="h-8 w-8" />,
      path: '/bikes',
      color: 'bg-green-500 hover:bg-green-600',
      available: user?.role === 'rent'
    },
    {
      title: 'My Wallet',
      description: 'Add money & view transactions',
      icon: <DollarSign className="h-8 w-8" />,
      path: '/balance',
      color: 'bg-purple-500 hover:bg-purple-600',
      available: true
    },
    {
      title: 'KYC Verification',
      description: 'Verify your identity',
      icon: <Shield className="h-8 w-8" />,
      path: '/kyc',
      color: 'bg-orange-500 hover:bg-orange-600',
      available: !user?.isKYCVerified && user?.role === 'rent'
    }
  ].filter(action => action.available);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              {!user?.isKYCVerified && user?.role === 'rent' && (
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  KYC Required
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trips */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Trips</h2>
              <Link 
                to="/trips" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            {recentTrips.length > 0 ? (
              <div className="space-y-4">
                {recentTrips.map((trip) => (
                  <div key={trip._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {trip.vehicleId?.model || 'Vehicle'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(trip.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {trip.totalAmount && (
                        <p className="font-medium text-green-600">
                          +{trip.totalAmount} ETB
                        </p>
                      )}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No trips yet</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by renting a vehicle.</p>
                <Link
                  to="/map"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Find Vehicles
                </Link>
              </div>
            )}
          </div>

          {/* Quick Stats & Insights */}
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Available Balance</p>
                  <p className="text-2xl font-bold mt-1">
                    {user?.balance?.toLocaleString()} ETB
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
              <Link
                to="/balance"
                className="mt-4 inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Add Money
              </Link>
            </div>

            {/* KYC Status */}
            {user?.role === 'rent' && (
              <div className={`rounded-xl p-6 ${
                user?.isKYCVerified 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-orange-50 border border-orange-200'
              }`}>
                <div className="flex items-center">
                  <Shield className={`h-6 w-6 ${
                    user?.isKYCVerified ? 'text-green-600' : 'text-orange-600'
                  } mr-3`} />
                  <div>
                    <h3 className="font-medium text-gray-900">
                      KYC Verification
                    </h3>
                    <p className={`text-sm ${
                      user?.isKYCVerified ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {user?.isKYCVerified 
                        ? 'Your identity has been verified' 
                        : 'Verify your identity to start renting'
                      }
                    </p>
                  </div>
                </div>
                {!user?.isKYCVerified && (
                  <Link
                    to="/kyc"
                    className="mt-4 inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Verify Now
                  </Link>
                )}
              </div>
            )}

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-medium text-green-600">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-medium text-blue-600">2.3 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rating</span>
                  <span className="font-medium text-yellow-600">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;