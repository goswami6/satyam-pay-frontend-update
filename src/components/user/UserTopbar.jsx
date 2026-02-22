import { Menu, Bell, User, LogOut, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserTopbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 fixed top-0 right-0 left-0 lg:left-72 z-40 transition-all duration-300">
      <div className="h-full px-6 flex items-center justify-between">
        
        {/* Left Side: Search & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Decorative Search Bar (Premium Look) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl w-64 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search transactions..." 
              className="bg-transparent border-none text-sm focus:outline-none text-slate-600 placeholder:text-slate-400 w-full"
            />
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Notifications */}
          <button className="p-2.5 hover:bg-slate-50 rounded-xl relative group transition-all">
            <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-1 ring-rose-200"></span>
          </button>

          {/* User Profile Dropdown Look */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 ml-2">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-slate-800 leading-none">
                {user?.name || "User Name"}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {user?.email || "user@example.com"}
              </p>
            </div>
            
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-all">
                <User className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
              </div>
              {/* Optional: Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2.5 hover:bg-rose-50 rounded-xl group transition-all ml-1"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserTopbar;