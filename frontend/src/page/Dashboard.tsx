import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../component/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    balance: 4250.75,
    earnings: 8960,
    isRenter: true
  });

  const activeBookings = [
    { id: 1, type: 'renting', bikeName: 'Electric Bike', time: 'Today 2:00 PM', amount: 720 },
    { id: 2, type: 'renting_out', bikeName: 'My Mountain Bike', customer: 'Alice', time: 'Now', amount: 450 }
  ];

  const nearbyBikes = [
    {
      id: 1, name: 'Mountain Bike Pro', price: 450, perMinute: 7.5, 
      distance: 0.8, rating: 4.7, ownerOnline: true, delivery: false
    },
    {
      id: 2, name: 'City Cruiser', price: 360, perMinute: 6.0, 
      distance: 1.2, rating: 4.5, ownerOnline: true, delivery: true
    }
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationEnabled(true),
        () => setLocationEnabled(false)
      );
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Status Bar Area */}
      <div className="h-6 bg-white"></div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white font-bold">
              RN
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">RideNow</h1>
              <p className="text-xs text-gray-600">Bike Sharing Platform</p>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-all duration-200 relative"
            >
              <svg 
                className="w-5 h-5 text-gray-600 animate-pulse" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                />
              </svg>
              {/* Notification indicator */}
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Home Page */}
      <main className="pb-4">
        {/* Location Prompt */}
        {!locationEnabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mx-4 mt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Location Services</p>
                <p className="text-sm text-blue-700">Enable location to find bikes near you</p>
              </div>
              <button 
                onClick={() => setLocationEnabled(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        )}

        {/* Welcome Header */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bike Rental Platform</h1>
              <p className="text-gray-600 mt-1">Welcome, {userData.name}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </div>
        </div>

        {/* Wallet & Stats */}
        <div className="px-4 mt-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-gray-300 text-sm font-medium">Available Balance</p>
                <p className="text-3xl font-bold mt-1">{formatCurrency(userData.balance)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-300 text-sm font-medium">Monthly Earnings</p>
                <p className="text-xl font-bold mt-1">{formatCurrency(userData.earnings)}</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-semibold text-center text-sm hover:bg-gray-100 transition-colors">
                Add Funds
              </button>
              <button className="flex-1 bg-white/10 text-white py-3 rounded-xl font-semibold text-center text-sm hover:bg-white/20 transition-colors">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/map')}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Find Bikes</h3>
              <p className="text-sm text-gray-600 mt-1">View available bikes on map</p>
            </button>

            <button 
              onClick={() => navigate('/rent')}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Rent Bike</h3>
              <p className="text-sm text-gray-600 mt-1">Browse and book bicycles</p>
            </button>

            <button 
              onClick={() => navigate('/add-bike')}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">List Bike</h3>
              <p className="text-sm text-gray-600 mt-1">Earn from your bicycle</p>
            </button>

            <button 
              onClick={() => navigate('/bookings')}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 text-left hover:shadow-md transition-shadow active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">My Bookings</h3>
              <p className="text-sm text-gray-600 mt-1">View rental history</p>
            </button>
          </div>
        </div>

        {/* Active Bookings */}
        <div className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Rentals</h2>
            <button 
              onClick={() => navigate('/bookings')}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${booking.type === 'renting' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.bikeName}</p>
                      <p className="text-sm text-gray-600">
                        {booking.type === 'renting' ? 'Renting' : `Rented to ${booking.customer}`} • {booking.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(booking.amount)}</p>
                    <p className="text-xs text-gray-600">{booking.type === 'renting' ? 'Payment' : 'Earning'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nearby Bikes */}
        <div className="px-4 mt-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Available Bikes</h2>
            <button 
              onClick={() => navigate('/rent')}
              className="text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {nearbyBikes.map((bike) => (
              <div key={bike.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center border border-blue-200">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{bike.name}</h3>
                        <p className="text-sm text-gray-600">{bike.distance} km away</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${bike.ownerOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div className={`w-2 h-2 rounded-full ${bike.delivery ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(bike.price)}/hr</p>
                        <p className="text-sm text-gray-600">{formatCurrency(bike.perMinute)}/min</p>
                      </div>
                      <button 
                        onClick={() => navigate(`/bike/${bike.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
                      >
                        Rent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Navigation Component */}
      <Navigation />
    </div>
  );
};

export default Dashboard;