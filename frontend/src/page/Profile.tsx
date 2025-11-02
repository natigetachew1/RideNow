import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../component/Navigation';

const Profile = () => {
  const navigate = useNavigate();
  const [userData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+251 912 345 678',
    joinDate: 'January 2024',
    verified: true,
    totalRides: 45,
    rating: 4.8,
    reviewsCount: 32
  });

  const menuItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      action: () => navigate('/edit-profile')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Verification',
      subtitle: userData.verified ? 'Verified account' : 'Verify your account',
      action: () => navigate('/kyc-verification'),
      badge: userData.verified ? 'Verified' : null
    },
    
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
      action: () => navigate('/support')
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      title: 'Logout',
      subtitle: 'Sign out of your account',
      action: () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
      },
      danger: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-blue-600 to-blue-800"></div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 pt-4 pb-20">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Profile</h1>
          <button 
            onClick={() => navigate('/edit-profile')}
            className="text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Profile Card */}
      <div className="px-4 -mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                JD
              </div>
              {userData.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
              <p className="text-sm text-gray-600">{userData.phone}</p>
              <p className="text-xs text-gray-500 mt-2">Member since {userData.joinDate}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{userData.totalRides}</p>
              <p className="text-xs text-gray-600 mt-1">Total Rides</p>
            </div>
            <div className="text-center border-l border-gray-200">
              <div className="flex items-center justify-center space-x-1">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <p className="text-2xl font-bold text-gray-900">{userData.rating}</p>
              </div>
              <p className="text-xs text-gray-600 mt-1">{userData.reviewsCount} Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-6 space-y-3 mb-8">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className={`w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all text-left ${
              item.danger ? 'hover:border-red-200' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                item.danger 
                  ? 'bg-red-50 text-red-600' 
                  : 'bg-gray-50 text-gray-600'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${item.danger ? 'text-red-600' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">{item.subtitle}</p>
              </div>
              {item.badge && (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  {item.badge}
                </span>
              )}
              <svg 
                className={`w-5 h-5 ${item.danger ? 'text-red-400' : 'text-gray-400'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation */}
      <Navigation />
    </div>
  );
};

export default Profile;
