import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  IndianRupee,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  Wallet,
  Send,
  CreditCard,
  BarChart3,
  CircleDollarSign,
  UserCheck,
  Hourglass,
  CalendarDays,
} from "lucide-react";
import { dashboardAPI } from "../../utils/api";

const Overview = () => {
  const [data, setData] = useState({
    stats: {
      totalTransactions: 0,
      transactionCount: 0,
      transactionChange: 0,
      totalRevenue: 0,
      revenueCount: 0,
      revenueChange: 0,
      totalCustomers: 0,
      customerChange: 0,
      totalSettlements: 0,
      settlementCount: 0,
      settlementChange: 0,
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisMonth: 0,
      userChange: 0,
      todayTransactions: 0,
      todayTransactionCount: 0,
      todayRevenue: 0,
      todayRevenueCount: 0,
      pendingWithdrawals: 0,
      pendingWithdrawalCount: 0,
      pendingPayouts: 0,
      approvedPayouts: 0,
      completedPayouts: 0,
      totalPayoutAmount: 0,
      platformBalance: 0,
    },
    weeklyData: [],
    recentTransactions: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getAdminStats();
      if (res.data) {
        setData(res.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    const n = Number(num) || 0;
    if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const stats = data.stats;

  const mainStatCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      subValue: `${stats.revenueCount} orders`,
      change: stats.revenueChange,
      icon: IndianRupee,
      gradient: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      title: "Total Transactions",
      value: formatCurrency(stats.totalTransactions),
      subValue: `${stats.transactionCount} transactions`,
      change: stats.transactionChange,
      icon: TrendingUp,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Users",
      value: formatNumber(stats.totalUsers),
      subValue: `${stats.activeUsers} active`,
      change: stats.userChange,
      icon: Users,
      gradient: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Settlements",
      value: formatCurrency(stats.totalSettlements),
      subValue: `${stats.settlementCount} withdrawals`,
      change: stats.settlementChange,
      icon: Wallet,
      gradient: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const todayStats = [
    {
      label: "Today's Revenue",
      value: formatCurrency(stats.todayRevenue),
      count: `${stats.todayRevenueCount} orders`,
      icon: CalendarDays,
      color: "text-violet-600",
      bg: "bg-violet-100",
    },
    {
      label: "Today's Transactions",
      value: formatCurrency(stats.todayTransactions),
      count: `${stats.todayTransactionCount} txns`,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Platform Balance",
      value: formatCurrency(stats.platformBalance),
      count: "User wallets",
      icon: CircleDollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      label: "Pending Withdrawals",
      value: formatCurrency(stats.pendingWithdrawals),
      count: `${stats.pendingWithdrawalCount} requests`,
      icon: Hourglass,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  const payoutStats = [
    { label: "Pending", value: stats.pendingPayouts, color: "bg-yellow-400" },
    { label: "Approved", value: stats.approvedPayouts, color: "bg-blue-500" },
    { label: "Completed", value: stats.completedPayouts, color: "bg-green-500" },
  ];

  const formattedUpdatedAt = lastUpdated
    ? lastUpdated.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  return (
    <div className="space-y-6 p-1">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Real-time insights for your payment platform
          </p>
          {formattedUpdatedAt && (
            <p className="text-xs text-gray-400 mt-1">Last synced: {formattedUpdatedAt}</p>
          )}
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 text-sm font-medium"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainStatCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full blur-xl`}></div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${parseFloat(stat.change) >= 0
                    ? "text-green-700 bg-green-50"
                    : "text-red-700 bg-red-50"
                    }`}
                >
                  {parseFloat(stat.change) >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(stat.change)}%
                </div>
              </div>

              <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {loading ? (
                  <span className="animate-pulse bg-gray-200 rounded h-6 w-24 block"></span>
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">{stat.subValue}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Stats + Payout Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Quick Stats</h3>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {todayStats.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center mb-2`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {loading ? "—" : item.value}
                </p>
                <p className="text-xs text-gray-400">{item.count}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payout Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Send className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">Payout Requests</h3>
          </div>

          <div className="space-y-3">
            {payoutStats.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Total Amount</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(stats.totalPayoutAmount)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Weekly Transactions</h3>
            </div>
          </div>

          {data.weeklyData && data.weeklyData.length > 0 ? (
            <div className="space-y-3">
              {data.weeklyData.map((day, index) => {
                const maxAmount = Math.max(...data.weeklyData.map(d => d.amount));
                const width = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20">
                      {new Date(day.date).toLocaleDateString("en-IN", { weekday: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-700 w-20 text-right">
                      {formatCurrency(day.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <p className="text-gray-400 text-sm">No data for this week</p>
            </div>
          )}
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
            </div>
          </div>

          {data.recentTransactions && data.recentTransactions.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.recentTransactions.slice(0, 6).map((txn, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {txn.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {txn.user?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-gray-500">{txn.transactionId?.slice(0, 16)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-green-600">
                      +{formatCurrency(txn.amount)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(txn.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <p className="text-gray-400 text-sm">No recent transactions</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Insights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-sm text-blue-100">Processing Speed</p>
          <p className="text-2xl font-bold mt-1">~2.3s</p>
          <p className="text-xs text-blue-200 mt-2">Average transaction time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <p className="text-sm text-emerald-100">Success Rate</p>
          <p className="text-2xl font-bold mt-1">98.5%</p>
          <p className="text-xs text-emerald-200 mt-2">Transaction success rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <p className="text-sm text-amber-100">Risk Score</p>
          <p className="text-2xl font-bold mt-1">Low</p>
          <p className="text-xs text-amber-200 mt-2">Platform health status</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;