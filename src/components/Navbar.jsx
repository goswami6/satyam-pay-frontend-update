import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Globe, LogOut, MessageSquare, LayoutDashboard,
  ChevronDown, User, Settings, HelpCircle, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../hooks/useSettings';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(null);
  const { user, logout, getUserId } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const megaMenuTimeout = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  // Check if user is logged in
  const isLoggedIn = !!(user || getUserId() || sessionStorage.getItem("userId"));

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle resize to reset states
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setMobileMenuActive(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
    setIsOpen(false);
  };

  const handleMegaMenuEnter = (id) => {
    // Only handle mega menu on desktop
    if (window.innerWidth >= 1024) {
      if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
      setActiveMega(id);
    }
  };

  const handleMegaMenuLeave = () => {
    // Only handle mega menu on desktop
    if (window.innerWidth >= 1024) {
      megaMenuTimeout.current = setTimeout(() => {
        setActiveMega(null);
      }, 150);
    }
  };

  const toggleMobileSubmenu = (id) => {
    // Only handle submenu on mobile
    if (window.innerWidth < 1024) {
      setMobileMenuActive(mobileMenuActive === id ? null : id);
    }
  };

  const menuItems = [
    {
      label: 'Products',
      id: 'payments',
      hasMegaMenu: true,
      mobileItems: [
        { label: 'Credit & Debit Cards', path: '/payment-methods/credit-debit-cards' },
        { label: 'UPI Payments', path: '/payment-methods/upi-payments' },
        { label: 'Digital Wallets', path: '/payment-methods/digital-wallets' },
        { label: 'Net Banking', path: '/payment-methods/net-banking' },
        { label: 'EMI Options', path: '/payment-methods/emi-options' },
        { label: 'Recurring Payments', path: '/payment-methods/recurring-payments' },
      ]
    },
    {
      label: 'Developers',
      id: 'resources',
      hasMegaMenu: true,
      mobileItems: [
        { label: 'API Reference', path: '/api-documentation' },
        { label: 'Payin API', path: '/api-documentation/payin' },
        { label: 'Payout API', path: '/payout-api-documentation' },
        { label: 'Webhooks', path: '/docs/webhooks' },
        { label: 'Quick Start', path: '/docs/quick-start' },
      ]
    },
    { label: 'Pricing', id: 'pricing', href: '/pricing' },
    { label: 'Company', id: 'company', href: '/about' },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled
        ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/50'
        : 'bg-white border-b border-gray-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg lg:text-xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                {settings.websiteName?.charAt(0) || 'S'}
              </div>
              <span className="hidden sm:inline font-bold text-base sm:text-lg lg:text-xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {settings.websiteName}
              </span>
            </Link>

            {/* Desktop Menu - Only shown on lg and above */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {menuItems.map((item) => {
                if (item.href) {
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-600 font-medium hover:text-blue-600 relative group transition-colors rounded-lg hover:bg-blue-50/50 whitespace-nowrap"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-1/2"></span>
                    </Link>
                  );
                }
                return (
                  <div key={item.id} className="relative">
                    <button
                      onMouseEnter={() => handleMegaMenuEnter(item.id)}
                      onMouseLeave={handleMegaMenuLeave}
                      className="px-3 xl:px-4 py-2 text-sm xl:text-base text-gray-600 font-medium hover:text-blue-600 relative group transition-colors rounded-lg hover:bg-blue-50/50 flex items-center gap-1 whitespace-nowrap"
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform duration-200 ${activeMega === item.id ? 'rotate-180' : ''}`} />
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-1/2"></span>
                    </button>
                    {activeMega === item.id && (
                      <div
                        onMouseEnter={() => handleMegaMenuEnter(item.id)}
                        onMouseLeave={handleMegaMenuLeave}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50"
                      >
                        <MegaMenu menuId={item.id} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
              <Link
                to="/contact"
                className="px-3 xl:px-3 py-2 text-sm xl:text-base text-gray-600 font-medium hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50 flex items-center gap-1.5 whitespace-nowrap"
              >
                <MessageSquare size={18} />
                <span className="hidden xl:inline">Support</span>
              </Link>

              

              {isLoggedIn ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 ml-2 p-1.5 pr-3 rounded-full hover:bg-blue-50/50 transition-colors border border-transparent hover:border-blue-200"
                  >
                    <div className="w-7 h-7 xl:w-8 xl:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-xs xl:text-sm shadow-md">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                        <Link
                          to="/user"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} />
                          Settings
                        </Link>
                        <Link
                          to="/help"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HelpCircle size={16} />
                          Help
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    to="/login"
                    className="px-3 xl:px-4 py-1.5 xl:py-2 text-sm xl:text-base text-gray-600 font-medium hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50/50 whitespace-nowrap"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 xl:px-5 py-1.5 xl:py-2 text-sm xl:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Shows on screens below lg */}
            {!isOpen && (
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Overlay (Shows only on screens below lg) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 lg:hidden"
            style={{ top: '64px' }}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <span className="font-semibold text-gray-900">Menu</span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Menu Items - Click only, no hover effects */}
                <div className="flex-1 overflow-y-auto py-4">
                  {menuItems.map((item) => (
                    <div key={item.id} className="px-4 mb-2">
                      {item.href ? (
                        <Link
                          to={item.href}
                          className="flex items-center justify-between w-full px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.label}
                          <ChevronRight size={18} className="text-gray-400" />
                        </Link>
                      ) : (
                        <div className="mb-2">
                          <button
                            onClick={() => toggleMobileSubmenu(item.id)}
                            className="flex items-center justify-between w-full px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                          >
                            {item.label}
                            <ChevronDown
                              size={18}
                              className={`text-gray-400 transition-transform duration-200 ${mobileMenuActive === item.id ? 'rotate-180' : ''
                                }`}
                            />
                          </button>

                          {/* Mobile Submenu - Only opens on click */}
                          <AnimatePresence>
                            {mobileMenuActive === item.id && item.mobileItems && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 pr-2 py-2 bg-gray-50 rounded-xl mt-1">
                                  {item.mobileItems.map((subItem, idx) => (
                                    <Link
                                      key={idx}
                                      to={subItem.path}
                                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                                      onClick={() => setIsOpen(false)}
                                    >
                                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                      {subItem.label}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  ))}

                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 mx-4 px-4 py-3 text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                  >
                    <MessageSquare size={18} />
                    Contact Support
                  </Link>
                </div>

                {/* Mobile Menu Footer - User Section */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/user"
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-200"
                          onClick={() => setIsOpen(false)}
                        >
                          <Settings size={16} />
                          Settings
                        </Link>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-all border border-gray-200"
                      >
                        <LogOut size={16} />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all border border-gray-200"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  )}

                  {/* Language Selector */}
                  <button className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    <Globe size={14} />
                    English (India)
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;