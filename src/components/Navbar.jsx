import React, { useState } from 'react';
import { Menu, X, Globe, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import MegaMenu from './MegaMenu';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);

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
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                RZ
              </div>
              <span className="hidden sm:inline">Razorpay</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => (
                <div key={item.id} className="relative group">
                  <button
                    onMouseEnter={() => setActiveMega(item.id)}
                    onMouseLeave={() => setActiveMega(null)}
                    className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 relative group transition-colors"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  {activeMega === item.id && (
                    <div
                      onMouseEnter={() => setActiveMega(item.id)}
                      onMouseLeave={() => setActiveMega(null)}
                    >
                      <MegaMenu menuId={item.id} />
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/pricing"
                className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
              >
                Pricing
              </Link>
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Globe size={20} className="text-gray-600" />
              </button>

              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="btn-primary">
                    Dashboard
                  </Link>
                  <button onClick={onLogout} className="p-2 hover:bg-gray-100 rounded-lg">
                    <LogOut size={20} className="text-gray-600" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Log in
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 animate-slide-down">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to="#"
                className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/pricing"
              className="px-4 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <div className="border-t pt-4 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="btn-primary w-full text-center">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="btn-secondary w-full text-center"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary w-full text-center">
                    Log in
                  </Link>
                  <Link to="/signup" className="btn-primary w-full text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
