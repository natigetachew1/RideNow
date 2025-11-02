import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from "./page/Home";
import Signup from './page/Signup';
import Login from './page/Login';
import KYCVerification from './page/KYCVerification';
import AdminLogin from './page/AdminLogin';
import AdminDashboard from './page/AdminDashboard';
import BikeManagement from './page/BikeManagement';
import ReportsPage from './page/ReportsPage';
import AdminProfile from './page/AdminProfile';
import UserManagement from './page/UserManagement';
import Dashboard from './page/Dashboard';
import MapPage from './page/MapPage';
import Rent from './page/Rent';
import Balance from './page/Balance';
import Profile from './page/Profile';
import EditProfile from './page/EditProfile';

const useAuth = () => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return { isAuthenticated };
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

import Sidebar from './component/Sidebar';


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <div className="flex-1 px-4 flex justify-between items-center md:ml-64">
            <h1 className="text-xl font-semibold text-gray-900">
              {window.location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Add any top-right content here (e.g., notifications, user menu) */}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none md:ml-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="w-full h-full">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/kyc-verification" element={<KYCVerification />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/rent" element={<Rent />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bikes" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <BikeManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ReportsPage />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/profile" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
      </Routes>
    </div>
  );
}

export default App;
