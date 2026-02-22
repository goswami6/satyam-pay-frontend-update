import { Search, Bell, User, ChevronDown, LogOut, ArrowLeftRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminTopbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchView } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Spacer for mobile hamburger menu */}
      <div className="w-12 lg:hidden"></div>

      {/* Search Bar - Hidden on mobile, visible from sm breakpoint */}
      <div className="hidden sm:flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users, transactions, settlements..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 ml-auto sm:ml-6">
        {/* Switch View Button - Only for Admin */}
        <button
          onClick={switchView}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
        >
          <ArrowLeftRight size={14} className="sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">
            {location.pathname.startsWith('/admin') ? 'User View' : 'Admin View'}
          </span>
        </button>

        <button className="relative p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={18} className="sm:w-5 sm:h-5" />
          <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-full flex items-center justify-center">
              <User size={14} className="sm:w-[18px] sm:h-[18px] text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown size={14} className="text-gray-600 hidden sm:block" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Settings</a>
              <hr className="my-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
