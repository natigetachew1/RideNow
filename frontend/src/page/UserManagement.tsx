import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, EyeIcon, PencilIcon, NoSymbolIcon } from '@heroicons/react/24/outline';

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
  documentVerified: boolean;
}

const UserManagement = () => {
  // Mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      role: 'rentee',
      status: 'verified',
      joinDate: '2025-01-15T10:30:00Z',
      lastLogin: '2025-10-30T14:22:10Z',
      totalBookings: 12,
      totalSpent: 1250.75,
      documentVerified: true,
    },
    {
      id: 'USR-002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 987-6543',
      role: 'renter',
      status: 'unverified',
      joinDate: '2025-02-20T08:15:00Z',
      lastLogin: '2025-10-29T16:45:30Z',
      totalBookings: 5,
      totalSpent: 0,
      documentVerified: false,
    },
    {
      id: 'USR-003',
      name: 'Admin User',
      email: 'admin@ridenow.com',
      phone: '+1 (555) 111-2222',
      role: 'admin',
      status: 'verified',
      joinDate: '2025-01-01T00:00:00Z',
      lastLogin: '2025-10-30T10:15:45Z',
      documentVerified: true,
    },
    {
      id: 'USR-004',
      name: 'Blocked User',
      email: 'blocked@example.com',
      phone: '+1 (555) 333-4444',
      role: 'rentee',
      status: 'blocked',
      joinDate: '2025-03-10T14:20:00Z',
      lastLogin: '2025-09-15T18:30:00Z',
      totalBookings: 3,
      totalSpent: 320.5,
      documentVerified: true,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Toggle user verification status
  const toggleVerification = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: user.status === 'verified' ? 'unverified' : 'verified',
            documentVerified: user.status !== 'verified'
          } 
        : user
    ));
  };

  // Toggle user block status
  const toggleBlock = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: user.status === 'blocked' ? 'verified' : 'blocked'
          } 
        : user
    ));
  };

  // Open user details modal with animation
  const openUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal and re-enable scrolling
  const closeModal = () => {
    setShowUserModal(false);
    document.body.style.overflow = 'auto';
  };

  // Close modal when clicking outside content
  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === 'modal-backdrop') {
      closeModal();
    }
  };

  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (showUserModal) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showUserModal]);

  // Format date to readable string with time
  const formatDate = (dateString: string, includeTime = false) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = true;
    }

    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get status badge with icon
  const getStatusBadge = (status: UserStatus) => {
    const statusConfig = {
      verified: {
        bg: 'bg-green-50',
        text: 'text-green-800',
        icon: CheckCircleIcon,
        label: 'Verified'
      },
      unverified: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-800',
        icon: XCircleIcon,
        label: 'Unverified'
      },
      blocked: {
        bg: 'bg-red-50',
        text: 'text-red-800',
        icon: NoSymbolIcon,
        label: 'Blocked'
      },
    };

    const { bg, text, icon: Icon, label } = statusConfig[status];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className={`h-3.5 w-3.5 mr-1.5 ${text}`} />
        {label}
      </span>
    );
  };

  // Get role badge with consistent styling
  const getRoleBadge = (role: UserRole) => {
    const roleConfig = {
      admin: {
        bg: 'bg-purple-50',
        text: 'text-purple-800',
        label: 'Admin'
      },
      renter: {
        bg: 'bg-blue-50',
        text: 'text-blue-800',
        label: 'Renter'
      },
      rentee: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-800',
        label: 'Rentee'
      },
    };

    const { bg, text, label } = roleConfig[role];

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
  };

  // Get verification status
  const getVerificationStatus = (user: User) => {
    if (user.status === 'blocked') {
      return 'Blocked';
    }
    return user.documentVerified ? 'Verified' : 'Not Verified';
  };

  // Get verification status class
  const getVerificationClass = (user: User) => {
    if (user.status === 'blocked') return 'bg-red-50 text-red-800';
    return user.documentVerified ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800';
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all registered users, verify accounts, and handle user status.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
        <div className="flex-1">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 pl-4 pr-10 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <div>
            <select
              id="role-filter"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="renter">Renter</option>
              <option value="rentee">Rentee</option>
            </select>
          </div>
          
          <div>
            <select
              id="status-filter"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      User
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">{user.email}</div>
                          <div className="text-gray-500">{user.phone}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => openUserDetails(user)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => toggleVerification(user.id)}
                              className={user.status === 'blocked' ? 'text-gray-400 cursor-not-allowed' : 'text-yellow-600 hover:text-yellow-900'}
                              disabled={user.status === 'blocked'}
                              title={user.status === 'verified' ? 'Mark as unverified' : 'Verify user'}
                            >
                              {user.status === 'verified' ? (
                                <XCircleIcon className="h-5 w-5" />
                              ) : (
                                <CheckCircleIcon className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => toggleBlock(user.id)}
                              className={user.status === 'blocked' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}
                              title={user.status === 'blocked' ? 'Unblock user' : 'Block user'}
                            >
                              <NoSymbolIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced User Details Modal */}
      {showUserModal && selectedUser && (
        <div 
          id="modal-backdrop"
          className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300"
          onClick={handleClickOutside}
        >
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
              {/* Modal Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold leading-7 text-gray-900">
                    User Profile
                  </h3>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={closeModal}
                  >
                    <span className="sr-only">Close</span>
                    <XCircleIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-6">
                {/* User Profile Header */}
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-2xl font-medium text-indigo-600">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {selectedUser.name}
                      </h4>
                      <div className="flex space-x-2">
                        {getRoleBadge(selectedUser.role)}
                        {getStatusBadge(selectedUser.status)}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      User ID: {selectedUser.id}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getVerificationStatus(selectedUser)}
                      </span>
                      <span className="mx-1">•</span>
                      <span>Member since {formatDate(selectedUser.joinDate)}</span>
                    </div>
                  </div>
                </div>

                {/* User Details Grid */}
                <div className="mt-8 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h5>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedUser.email}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedUser.phone}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-3">Activity</h5>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last login</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(selectedUser.lastLogin, true)}
                        </dd>
                      </div>
                      {selectedUser.totalBookings !== undefined && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Total bookings</dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {selectedUser.totalBookings} {selectedUser.totalBookings === 1 ? 'booking' : 'bookings'}
                          </dd>
                        </div>
                      )}
                      {selectedUser.totalSpent !== undefined && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Total spent</dt>
                          <dd className="mt-1 text-sm font-medium text-gray-900">
                            ${selectedUser.totalSpent.toFixed(2)}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Document Verification Status */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-500">Document Verification</h5>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getVerificationClass(selectedUser)}`}>
                      {selectedUser.documentVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  {!selectedUser.documentVerified && selectedUser.status !== 'blocked' && (
                    <div className="mt-3 bg-yellow-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <XCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Verification Required</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>This user has not yet submitted their verification documents.</p>
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              className="inline-flex items-center rounded-md bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                              onClick={() => {
                                // Handle request verification
                                toggleVerification(selectedUser.id);
                                closeModal();
                              }}
                            >
                              Request Verification
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => {
                      // Handle edit user
                      console.log('Edit user:', selectedUser.id);
                    }}
                  >
                    <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
                    Edit Profile
                  </button>
                  <button
                    type="button"
                    className={`inline-flex items-center rounded-md border ${selectedUser.status === 'blocked' ? 'bg-green-600 hover:bg-green-700 border-transparent text-white' : 'border-red-300 text-red-700 hover:bg-red-50'} px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedUser.status === 'blocked' ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
                    onClick={() => {
                      toggleBlock(selectedUser.id);
                      closeModal();
                    }}
                  >
                    {selectedUser.status === 'blocked' ? (
                      <>
                        <CheckCircleIcon className="-ml-1 mr-2 h-4 w-4" />
                        Unblock User
                      </>
                    ) : (
                      <>
                        <NoSymbolIcon className="-ml-1 mr-2 h-4 w-4" />
                        Block User
                      </>
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={closeModal}
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
