import { Search, Bell, User, ChevronDown, LogOut, Settings, X, Loader2, CheckCheck, Users, CreditCard, Wallet, MessageCircle, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminTopbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ users: [], transactions: [] });
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // Fetch users and transactions for search
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, txnRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/all`).then(r => r.ok ? r.json() : []),
          fetch(`${API_BASE_URL}/api/transactions/admin/all`).then(r => r.ok ? r.json() : [])
        ]);
        setAllUsers(usersRes || []);
        setAllTransactions(txnRes || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], transactions: [] });
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    const query = searchQuery.toLowerCase();

    // Search users
    const filteredUsers = allUsers.filter(u => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const uniqueId = (u.uniqueId || "").toLowerCase();
      return name.includes(query) || email.includes(query) || uniqueId.includes(query);
    }).slice(0, 5);

    // Search transactions
    const filteredTxns = allTransactions.filter(txn => {
      const transactionId = (txn.transactionId || "").toLowerCase();
      const customerName = (txn.customerName || "").toLowerCase();
      const amount = String(txn.amount || "");
      const status = (txn.status || "").toLowerCase();
      return transactionId.includes(query) || customerName.includes(query) || amount.includes(query) || status.includes(query);
    }).slice(0, 5);

    setSearchResults({ users: filteredUsers, transactions: filteredTxns });
    setShowResults(true);
    setSearchLoading(false);
  }, [searchQuery, allUsers, allTransactions]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch admin notifications (system notifications)
  const fetchNotifications = async () => {
    try {
      setNotificationLoading(true);
      // Fetch system/admin notifications
      const res = await fetch(`${API_BASE_URL}/api/notifications/admin/system?limit=20`);
      const data = await res.json();
      if (data.success) {
        const unread = (data.notifications || []).filter(n => !n.isRead);
        setNotifications(unread);
        setUnreadCount(data.unreadCount || unread.length);
      }
    } catch (error) {
      // If no admin notifications endpoint, create mock data or leave empty
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/admin/read-all`, { method: 'PUT' });
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Close dropdown first
    setShowNotifications(false);

    // Navigate to the link
    if (notification.type === 'user_message') {
      // For user messages, go to support page with chatId
      const chatId = notification.metadata?.chatId || '';
      navigate(`/admin/support${chatId ? `?chatId=${chatId}` : ''}`);
    } else if (notification.link) {
      navigate(notification.link);
    } else if (notification.type === 'support') {
      navigate('/admin/support');
    }

    // Then mark as read
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user': return <Users className="w-4 h-4 text-blue-500" />;
      case 'user_message': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'transaction': return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'withdrawal': return <Wallet className="w-4 h-4 text-amber-500" />;
      case 'support': return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
      {/* Spacer for mobile hamburger menu */}
      <div className="w-12 lg:hidden"></div>

      {/* Search Bar - Hidden on mobile, visible from sm breakpoint */}
      <div ref={searchRef} className="hidden sm:flex items-center flex-1 max-w-xl relative">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, transactions..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
            {searchLoading ? (
              <div className="p-4 text-center">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-500" />
              </div>
            ) : (searchResults.users.length === 0 && searchResults.transactions.length === 0) ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <>
                {/* Users Results */}
                {searchResults.users.length > 0 && (
                  <div>
                    <div className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                      Users ({searchResults.users.length})
                    </div>
                    {searchResults.users.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => { navigate(`/admin/users/${u._id}`); setSearchQuery(""); setShowResults(false); }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{u.name || u.email}</p>
                          <p className="text-xs text-slate-500">{u.uniqueId} • {u.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Transactions Results */}
                {searchResults.transactions.length > 0 && (
                  <div>
                    <div className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                      Transactions ({searchResults.transactions.length})
                    </div>
                    {searchResults.transactions.map((txn) => (
                      <div
                        key={txn._id}
                        onClick={() => { navigate(`/admin/transactions`); setSearchQuery(""); setShowResults(false); }}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 flex items-center gap-3"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.status === 'Success' || txn.status === 'Completed' ? 'bg-green-100' :
                          txn.status === 'Pending' ? 'bg-amber-100' : 'bg-red-100'
                          }`}>
                          <CreditCard className={`w-4 h-4 ${txn.status === 'Success' || txn.status === 'Completed' ? 'text-green-600' :
                            txn.status === 'Pending' ? 'text-amber-600' : 'text-red-600'
                            }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{txn.transactionId}</p>
                          <p className="text-xs text-slate-500">₹{txn.amount} • {txn.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 ml-auto sm:ml-6">
        {/* Notification Bell */}
        <div ref={notificationRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={18} className="sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/20 sm:hidden"
                onClick={() => setShowNotifications(false)}
              />
              <div className="fixed sm:absolute inset-x-0 bottom-0 sm:bottom-auto sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 bg-white rounded-t-2xl sm:rounded-xl shadow-2xl border border-slate-200 z-50 sm:w-[360px] max-h-[70vh] sm:max-h-[480px] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    <p className="text-xs text-slate-500">{unreadCount} unread</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                  {notificationLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="px-4 py-3 hover:bg-slate-50 border-b border-slate-100 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notification.message}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <Bell className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">No notifications</p>
                      <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown */}
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
              <Link
                to="/admin/profile"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setShowDropdown(false)}
              >
                <User size={14} />
                Profile
              </Link>
              <Link
                to="/admin/settings"
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setShowDropdown(false)}
              >
                <Settings size={14} />
                Website Settings
              </Link>
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
