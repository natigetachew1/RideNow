import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'User Management', href: '/admin/users', icon: UserCircleIcon },
  { name: 'Bike Management', href: '/admin/bikes', icon: Cog6ToothIcon },
  { name: 'Reports', href: '/admin/reports', icon: DocumentChartBarIcon },
  { name: 'Profile', href: '/admin/profile', icon: UserCircleIcon },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activePath, setActivePath] = useState(location.pathname);

  
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin/login');
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && isMobile && !target.closest('.sidebar-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isMobile]);

 
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  
  const MobileMenuButton = () => (
    <div className="md:hidden fixed top-4 left-4 z-50">
      <button
        onClick={toggleSidebar}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );

  
  const Overlay = () => (
    isOpen && isMobile ? (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>
    ) : null
  );

  return (
    <>
      <MobileMenuButton />
      <Overlay />
      
      {/* Sidebar */}
      <div 
        className={`sidebar-container fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-30 transition duration-200 ease-in-out w-64 bg-white border-r border-gray-200 flex flex-col`}
      >
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <h1 className="text-2xl font-bold text-indigo-600">RideNow</h1>
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              Admin
            </span>
          </div>
          
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = activePath === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}`}
                    aria-hidden="true"
                  />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
        
        {/* Logout Button */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
