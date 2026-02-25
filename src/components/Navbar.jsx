import React, { useState } from 'react';
import { Menu, X, Globe, LogOut, MessageSquare, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const { user, logout, getUserId } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = !!(user || getUserId() || sessionStorage.getItem("userId"));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Payments', id: 'payments' },
    { label: 'Banking+', id: 'banking' },
    { label: 'Payroll', id: 'payroll' },
    { label: 'Engage', id: 'engage' },
    { label: 'Partners', id: 'partners' },
    { label: 'Resources', id: 'resources' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                RZ
              </div>
              <span className="hidden sm:inline">Razorpay</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {menuItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onMouseEnter={() => setActiveMega(item.id)}
                    onMouseLeave={() => setActiveMega(null)}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 relative group transition-colors whitespace-nowrap"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {activeMega === item.id && (
                    <div
                      onMouseEnter={() => setActiveMega(item.id)}
                      onMouseLeave={() => setActiveMega(null)}
                      className="absolute top-full left-0 pt-2 z-50"
                    >
                      <MegaMenu menuId={item.id} />
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/pricing"
                className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors relative group whitespace-nowrap"
              >
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <Link
                to="/contact"
                className="px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <MessageSquare size={18} />
                <span className="text-sm">Contact Us</span>
              </Link>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <Globe size={20} className="text-gray-600" />
              </button>

              {isLoggedIn ? (
                <>
                  <Link to="/user" className="btn-primary whitespace-nowrap flex items-center gap-2">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 group" title="Logout">
                    <LogOut size={20} className="text-gray-600 group-hover:text-red-600" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary whitespace-nowrap">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary whitespace-nowrap">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-3">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to="#"
                  className="px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/pricing"
                className="px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all text-left"
              >
                Contact Us
              </Link>
              <div className="border-t mt-3 pt-4 flex flex-col gap-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/user"
                      className="btn-primary w-full text-center flex items-center justify-center gap-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="btn-secondary w-full text-center flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary w-full text-center" onClick={() => setIsOpen(false)}>
                      Log in
                    </Link>
                    <Link to="/signup" className="btn-primary w-full text-center" onClick={() => setIsOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
