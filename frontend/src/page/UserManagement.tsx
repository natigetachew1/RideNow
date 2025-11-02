import { useState } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EyeIcon, 
  PencilIcon, 
  NoSymbolIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

type UserRole = 'admin' | 'renter' | 'rentee';
type UserStatus = 'verified' | 'unverified' | 'blocked';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joinDate: string;
  lastLogin: string;
  totalBookings?: number;
  totalSpent?: number;
  location?: string;
  address?: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    role: 'renter',
    status: 'verified',
    joinDate: '2023-01-15',
    lastLogin: '2023-10-30T14:30:00Z',
    totalBookings: 12,
    totalSpent: 1250,
    location: 'New York, USA',
    address: '123 Main St, Apt 4B, New York, NY 10001'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 987 654 3210',
    role: 'rentee',
    status: 'unverified',
    joinDate: '2023-05-22',
    lastLogin: '2023-10-28T09:15:00Z',
    totalBookings: 3,
    totalSpent: 320,
    location: 'San Francisco, USA',
    address: '456 Market St, San Francisco, CA 94103'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@ridenow.com',
    phone: '+1 555 123 4567',
    role: 'admin',
    status: 'verified',
    joinDate: '2022-11-10',
    lastLogin: '2023-10-30T10:45:00Z',
    totalBookings: 0,
    totalSpent: 0,
    location: 'Headquarters',
    address: '789 Admin Ave, Silicon Valley, CA 94025'
  }
];

const UserManagement = () => {
  const [users] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const getStatusBadge = (status: UserStatus) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (status) {
      case 'verified':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Verified
          </span>
        );
      case 'unverified':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Unverified
          </span>
        );
      case 'blocked':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Blocked
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    
    switch (role) {
      case 'admin':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Admin</span>;
      case 'renter':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Renter</span>;
      case 'rentee':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Rentee</span>;
      default:
        return null;
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">User Management</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(user.joinDate)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View User"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit User"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {user.status !== 'blocked' ? (
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Block User"
                          >
                            <NoSymbolIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Unblock User"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsViewModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
                    <UserCircleIcon className="h-10 w-10 text-indigo-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {selectedUser.name}
                        </h3>
                        <div className="mt-1 flex items-center space-x-2">
                          {getRoleBadge(selectedUser.role)}
                          {getStatusBadge(selectedUser.status)}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setIsViewModalOpen(false)}
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <EnvelopeIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          {selectedUser.email}
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <PhoneIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          {selectedUser.phone}
                        </div>
                      </div>
                      
                      {selectedUser.location && (
                        <div className="sm:col-span-2">
                          <div className="flex items-start text-sm text-gray-500">
                            <svg 
                              className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                              />
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                              />
                            </svg>
                            <div>
                              <p className="font-medium">{selectedUser.location}</p>
                              {selectedUser.address && (
                                <p className="text-xs text-gray-400">{selectedUser.address}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          Joined {formatDate(selectedUser.joinDate)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center text-sm text-gray-500">
                          <ClockIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          Last active {formatDateTime(selectedUser.lastLogin)}
                        </div>
                      </div>
                      
                      {selectedUser.totalBookings !== undefined && (
                        <div>
                          <div className="flex items-center text-sm text-gray-500">
                            <BookOpenIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                            {selectedUser.totalBookings} bookings
                          </div>
                        </div>
                      )}
                      
                      {selectedUser.totalSpent !== undefined && selectedUser.totalSpent > 0 && (
                        <div>
                          <div className="flex items-center text-sm text-gray-500">
                            <CurrencyDollarIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                            ${selectedUser.totalSpent.toLocaleString()} spent
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 text-right">
                <button
                  type="button"
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;