import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Eye,
  Download,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

const Dashboard = () => {
  const [filter, setFilter] = useState('today');

  const stats = [
    { label: 'Total Revenue', value: '₹2,45,890', change: '+12.5%', icon: TrendingUp, positive: true },
    { label: 'Transactions', value: '1,234', change: '+8.2%', icon: CreditCard, positive: true },
    { label: 'Customers', value: '892', change: '+5.1%', icon: Users, positive: true },
    { label: 'Success Rate', value: '99.8%', change: '+0.2%', icon: BarChart3, positive: true },
  ];

  const transactions = [
    {
      id: 'TXN001',
      customer: 'Acme Corp',
      amount: '₹50,000',
      status: 'Success',
      date: '2024-02-10',
      type: 'credit',
    },
    {
      id: 'TXN002',
      customer: 'Tech Startup',
      amount: '₹35,000',
      status: 'Success',
      date: '2024-02-10',
      type: 'credit',
    },
    {
      id: 'TXN003',
      customer: 'Refund Processing',
      amount: '-₹5,000',
      status: 'Completed',
      date: '2024-02-09',
      type: 'debit',
    },
    {
      id: 'TXN004',
      customer: 'Global Markets',
      amount: '₹120,000',
      status: 'Success',
      date: '2024-02-09',
      type: 'credit',
    },
    {
      id: 'TXN005',
      customer: 'Beta Testing',
      amount: '₹25,000',
      status: 'Pending',
      date: '2024-02-09',
      type: 'credit',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
            <Download size={18} />
            Export Report
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-xl border border-gray-200 p-6 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <stat.icon size={20} className="text-blue-600" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm font-medium flex items-center gap-1 ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  {stat.change}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts & Analytics */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Revenue Chart */}
          <motion.div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Revenue Trend</h2>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Mock Chart */}
            <div className="space-y-4">
              {[65, 78, 72, 85, 90, 88, 95].map((value, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 text-sm text-gray-600 font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-xs font-semibold"
                      style={{ width: `${value}%` }}
                    >
                      {idx === 6 ? `₹${value}k` : ''}
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-900 font-medium">₹{value}k</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Quick Stats</h2>

            {[
              { label: 'Avg Transaction', value: '₹2,045' },
              { label: 'Today Revenue', value: '₹1,24,567' },
              { label: 'Pending Payouts', value: '₹50,000' },
              { label: 'Failed Trans.', value: '2' },
            ].map((item, idx) => (
              <div key={idx} className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                <p className="text-lg font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={18} />
                Filter
              </button>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">ID</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-blue-600">{txn.id}</td>
                    <td className="py-4 px-4 text-sm text-gray-900">{txn.customer}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                      <div className={txn.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {txn.amount}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        txn.status === 'Success'
                          ? 'bg-green-100 text-green-800'
                          : txn.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{txn.date}</td>
                    <td className="py-4 px-4">
                      <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                        <Eye size={18} className="text-gray-600" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All Button */}
          <button className="mt-6 text-blue-600 font-medium hover:text-blue-700 transition-colors">
            View all transactions →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
