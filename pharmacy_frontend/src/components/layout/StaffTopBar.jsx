import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext} from '../../context/UserContext.jsx';
import 'remixicon/fonts/remixicon.css';

const StaffTopBar = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const routeTitles = {
    '/staff': 'Staff Dashboard',
    '/add-sale': 'Add Sale',
    '/out-of-stock': 'Out of Stock Items',
    '/expiring': 'Expiring Products',
    '/transactions': 'Transactions',
  };

  const getCurrentTitle = () => {
    return routeTitles[location.pathname] || 'Staff Dashboard';
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-[#023047] shadow p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <a href="/staff">
          <h1 className="text-l font-bold bg-black text-white px-1 py-1 rounded w-fit">
            MEDIX PHARMA
          </h1>
        </a>
      </div>
      <div className="flex items-center relative">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src="/src/assets/pharma3.jpg"
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2 text-white object-cover"
          />
          <span className="mr-2 text-white">{user.name || 'Staff User'}</span>
          <span className="text-gray-400 mr-2">{user.role || 'Staff'}</span>
          <svg
            className="w-4 h-4 text-white"
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
  );
};

export default StaffTopBar;