import { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Users, Wallet, Loader2 } from 'lucide-react';
import { dashboardAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    transactionChange: "0",
    totalSettlements: 0,
    settlementChange: "0",
    totalRevenue: 0,
    revenueChange: "0",
    totalCustomers: 0,
    customerChange: "0"
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, transactionsRes] = await Promise.all([
        dashboardAPI.getStats(user._id),
        dashboardAPI.getRecentTransactions(user._id, 5)
      ]);

      setStats(statsRes.data.stats);
      setRecentTransactions(transactionsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString("en-IN") || 0}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const statsConfig = [
    {
      icon: CreditCard,
      label: 'Total Transactions',
      value: formatCurrency(stats.totalTransactions),
      change: `${stats.transactionChange > 0 ? '+' : ''}${stats.transactionChange}%`,
      color: 'blue',
      positive: parseFloat(stats.transactionChange) >= 0
    },
    {
      icon: Wallet,
      label: 'Settlements',
      value: formatCurrency(stats.totalSettlements),
      change: `${stats.settlementChange > 0 ? '+' : ''}${stats.settlementChange}%`,
      color: 'green',
      positive: parseFloat(stats.settlementChange) >= 0
    },
    {
      icon: TrendingUp,
      label: 'Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: `${stats.revenueChange > 0 ? '+' : ''}${stats.revenueChange}%`,
      color: 'purple',
      positive: parseFloat(stats.revenueChange) >= 0
    },
    {
      icon: Users,
      label: 'Customers',
      value: stats.totalCustomers?.toLocaleString() || '0',
      change: `${stats.customerChange > 0 ? '+' : ''}${stats.customerChange}%`,
      color: 'orange',
      positive: parseFloat(stats.customerChange) >= 0
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'User'}! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{stat.value}</h3>
            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions yet
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {txn.id?.slice(0, 12)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{txn.description}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${txn.type === 'Credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {txn.type === 'Credit' ? '+' : '-'}₹{txn.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${txn.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(txn.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
