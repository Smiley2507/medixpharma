import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';
import { UserContext} from '../../context/UserContext.jsx';
import { useSearch } from '../../context/SearchContext.jsx';
import SearchResults from '../search/SearchResults';

const Layout = ({ children }) => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { searchQuery, setSearchQuery, performSearch, setShowResults } = useSearch();

  const navItems = [
    { name: 'Dashboard', icon: 'ri-home-line', path: '/' },
    { name: 'Products', icon: 'ri-box-3-line', path: '/products' },
    { name: 'Stock', icon: 'ri-stack-line', path: '/stocks' },
    { name: 'Sales', icon: 'ri-money-dollar-circle-line', path: '/sales' },
    { name: 'Suppliers', icon: 'ri-group-line', path: '/suppliers' },
    { name: 'Users', icon: 'ri-user-settings-line', path: '/users' },
    { name: 'Report', icon: 'ri-line-chart-line', path: '/reports' },
  ];

  const routeTitles = {
    '/': 'Dashboard',
    '/products': 'Product Management',
    '/sales': 'Sales Management',
    '/stock': 'Stock Management',
    '/suppliers': 'Supplier Management',
    '/users': 'User Management',
    '/reports': 'Reports',
    '/out-of-stock': 'Out of Stock Items',
    '/expiring': 'Expiring Products',
    '/transactions': 'Transactions',
  };

  const getCurrentTitle = () => {
    if (routeTitles[location.pathname]) {
      return routeTitles[location.pathname];
    }
    const basePath = '/' + location.pathname.split('/')[1];
    return routeTitles[basePath] || 'Pharmacy Management';
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-44 bg-[#023047] text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4">
          <h1 className="text-l font-bold bg-black text-white px-1 py-1 rounded w-fit">
            MEDIX PHARMA
          </h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-2 px-4 hover:bg-blue-200 hover:text-black ${
                location.pathname === item.path ? 'bg-[#a2d2ff] text-black' : ''
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-44">
        {/* Topbar */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              className="md:hidden mr-4"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold text-blue-600">{getCurrentTitle()}</h2>
          </div>
          
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 search-container relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, stocks, sales..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  performSearch(e.target.value);
                }}
                onFocus={() => searchQuery && setShowResults(true)}
              />
              <i className="ri-search-line absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <SearchResults />
          </div>

          <div className="flex items-center relative">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src="/pharma2.jpg"
                alt="Profile"
                className="w-8 h-8 rounded-full mr-2 object-cover"
              />
              <span>{user.name || 'Pharmacist'}</span>
              <span className="ml-2 text-gray-500">{user.role || 'Admin'}</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;