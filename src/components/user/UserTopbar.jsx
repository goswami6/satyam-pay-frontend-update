import { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, LogOut, Home, Search, X, ArrowRight, Loader2, CheckCheck, Trash2, Info, AlertCircle, CheckCircle, Megaphone, MessageCircle, CreditCard, FileCheck, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSupportChat } from '../../context/SupportChatContext';
import { useNavigate } from 'react-router-dom';
import { userAPI, transactionAPI, notificationAPI } from '../../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserTopbar = ({ toggleSidebar }) => {
  const { user, logout, getUserId } = useAuth();
  const { openSupportChat } = useSupportChat();
  const navigate = useNavigate();
  const userId = getUserId() || sessionStorage.getItem("userId");
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);

  // Fetch user profile for image
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await userAPI.getProfile(userId);
        if (res.data) {
          setProfileImage(res.data.profileImage || "");
          setUserData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [userId]);

  // Fetch transactions for search
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      try {
        const res = await transactionAPI.getTransactions(userId);
        setAllTransactions(res.data || []);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };
    fetchTransactions();
  }, [userId]);

  // Handle search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    const query = searchQuery.toLowerCase();

    const filtered = allTransactions.filter(txn => {
      const transactionId = (txn.transactionId || "").toLowerCase();
      const description = (txn.description || "").toLowerCase();
      const customerName = (txn.customerName || "").toLowerCase();
      const amount = String(txn.amount || "");
      const status = (txn.status || "").toLowerCase();
      const category = (txn.category || "").toLowerCase();

      return transactionId.includes(query) ||
        description.includes(query) ||
        customerName.includes(query) ||
        amount.includes(query) ||
        status.includes(query) ||
        category.includes(query);
    });

    setSearchResults(filtered.slice(0, 5)); // Show max 5 results
    setShowResults(true);
    setSearchLoading(false);
  }, [searchQuery, allTransactions]);

  // Close search results when clicking outside
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

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      setNotificationLoading(true);
      const res = await notificationAPI.getNotifications(userId, 20);
      if (res.data) {
        // Only show unread notifications
        const unreadNotifications = (res.data.notifications || []).filter(n => !n.isRead);
        setNotifications(unreadNotifications);
        setUnreadCount(res.data.unreadCount || unreadNotifications.length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      // Remove from dropdown (shows only unread)
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      // Update in allNotifications list (mark as read, don't remove)
      setAllNotifications(prev => prev.map(n =>
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead(userId);
      // Clear dropdown (shows only unread)
      setNotifications([]);
      // Mark all as read in allNotifications (don't remove)
      setAllNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      const notification = notifications.find(n => n._id === notificationId) || allNotifications.find(n => n._id === notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setAllNotifications(prev => prev.filter(n => n._id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already
    if (!notification.isRead) {
      await handleMarkAsRead(notification._id);
    }
    // Close dropdowns
    setShowNotifications(false);
    setShowAllNotifications(false);

    // Navigate based on notification type
    const type = notification.type;

    if (type === 'support') {
      // Open support chat for support notifications
      openSupportChat();
    } else if (type === 'transaction') {
      navigate('/user/transactions');
    } else if (type === 'kyc') {
      navigate('/user/user-profile');
    } else if (type === 'payout') {
      navigate('/user/withdraw-money');
    } else if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleViewAllNotifications = async () => {
    setShowNotifications(false);
    setShowAllNotifications(true);
    try {
      setNotificationLoading(true);
      // Fetch ALL notifications (both read and unread)
      const res = await notificationAPI.getNotifications(userId, 100);
      if (res.data) {
        // Show all notifications
        setAllNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch all notifications:", error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'error':
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-indigo-500" />;
      case 'support':
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case 'transaction':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'kyc':
        return <FileCheck className="w-4 h-4 text-teal-500" />;
      case 'payout':
        return <Wallet className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationAction = (type) => {
    switch (type) {
      case 'support':
        return 'Open chat';
      case 'transaction':
        return 'View transactions';
      case 'kyc':
        return 'View profile';
      case 'payout':
        return 'View withdrawals';
      default:
        return 'Click to view';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now - notifDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return notifDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleViewTransaction = (txnId) => {
    setShowResults(false);
    setSearchQuery("");
    navigate('/dashboard/transactions', { state: { highlightTxn: txnId } });
  };

  const handleViewAll = () => {
    setShowResults(false);
    navigate('/dashboard/transactions');
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  // Generate short unique ID display
  const getShortId = () => {
    const id = userId || user?._id || "";
    if (!id) return "ID: N/A";
    return `User ID: ${id.slice(-8).toUpperCase()}`;
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

          {/* Working Search Bar */}
          <div className="hidden md:block relative" ref={searchRef}>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl w-72 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                placeholder="Search transactions..."
                className="bg-transparent border-none text-sm focus:outline-none text-slate-600 placeholder:text-slate-400 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setShowResults(false); }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {searchLoading && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <>
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((txn) => (
                        <button
                          key={txn._id}
                          onClick={() => handleViewTransaction(txn._id)}
                          className="w-full px-4 py-3 hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {txn.description || txn.customerName || 'Transaction'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {txn.transactionId?.slice(-8)?.toUpperCase() || 'N/A'} • {txn.category || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right ml-3">
                            <p className={`text-sm font-bold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {txn.type === 'Credit' ? '+' : '-'}{formatAmount(txn.amount)}
                            </p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(txn.status)}`}>
                              {txn.status}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleViewAll}
                      className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 text-sm font-medium text-indigo-600 flex items-center justify-center gap-2 transition-colors"
                    >
                      View All Transactions
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : searchQuery ? (
                  <div className="px-4 py-6 text-center">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No transactions found</p>
                    <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Back to Home Button */}
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-xl group transition-all"
            title="Back to Home"
          >
            <Home className="w-5 h-5 text-indigo-600" />
            {/* <span className="hidden sm:inline text-sm font-medium text-indigo-600">Home</span> */}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 hover:bg-slate-50 rounded-xl relative group transition-all"
            >
              <Bell className="w-5 h-5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{unreadCount > 9 ? '9+' : unreadCount}</span>
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                {/* Mobile Overlay */}
                <div
                  className="fixed inset-0 bg-black/30 z-40 sm:hidden"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="fixed inset-x-2 top-24 bottom-auto sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-96 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[80vh] sm:max-h-[500px] flex flex-col">
                  {/* Header */}
                  <div className="flex-shrink-0 px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkAllAsRead(); }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="sm:hidden p-1 hover:bg-slate-200 rounded"
                      >
                        <X className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto overscroll-contain">
                    {notificationLoading ? (
                      <div className="py-8 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-indigo-50/50' : ''
                            }`}
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm ${!notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-[10px] text-slate-400 flex-shrink-0">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-indigo-500 mt-1.5 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3" />
                                {getNotificationAction(notification.type)}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {!notification.isRead && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                                    className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification._id); }}
                                  className="text-[10px] text-slate-400 hover:text-rose-600 font-medium flex items-center gap-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <Bell className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No notifications yet</p>
                        <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Dropdown Look */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100 ml-2">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-bold text-indigo-600 leading-none">
                {getShortId()}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {user?.email || userData?.email || "user@example.com"}
              </p>
            </div>

            <div className="relative group cursor-pointer">
              {profileImage ? (
                <img
                  src={`${API_BASE_URL}${profileImage}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-all"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-all">
                  <User className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
              )}
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

      {/* All Notifications Slider - Full Screen Modal on Mobile */}
      {showAllNotifications && (
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAllNotifications(false)}
          />

          {/* Slider Panel - Full width on mobile, 400px on desktop */}
          <div className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col animate-slide-in-right">
            {/* Slider Header */}
            <div className="flex-shrink-0 px-4 sm:px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">All Notifications</h2>
                <p className="text-[11px] sm:text-xs text-indigo-200 mt-0.5">{allNotifications.length} total, {unreadCount} unread</p>
              </div>
              <button
                onClick={() => setShowAllNotifications(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Actions Bar */}
            <div className="flex-shrink-0 px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-600">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List - Scrollable */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {notificationLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                  <p className="text-sm text-slate-500">Loading notifications...</p>
                </div>
              ) : allNotifications.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {allNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-4 py-4 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100 ${!notification.isRead ? 'bg-indigo-50/60' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-tight ${!notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[11px] text-indigo-600 font-medium flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              {getNotificationAction(notification.type)}
                            </p>
                            <div className="flex items-center gap-3">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                                  className="text-[10px] text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                  Read
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteNotification(notification._id); }}
                                className="text-[10px] text-slate-400 hover:text-rose-600 font-medium flex items-center gap-0.5"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">No notifications yet</p>
                  <p className="text-xs text-slate-400 mt-1">You'll see notifications here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserTopbar;