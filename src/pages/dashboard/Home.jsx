import { ArrowRight, TrendingUp, Wallet, CreditCard, BarChart3, ArrowUpRight, Home as HomeIcon, ArrowLeftRight, FileText, Link as LinkIcon, DollarSign, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const recommendedItems = [
    { icon: HomeIcon, label: 'Home', path: '/dashboard/payments' },
    { icon: ArrowLeftRight, label: 'Transactions', path: '/dashboard/payments/transactions' },
    { icon: Wallet, label: 'Settlements', path: '/dashboard/payments/settlements' },
    { icon: FileText, label: 'Reports', path: '/dashboard/payments/reports' },
    { icon: LinkIcon, label: 'Payment Links', path: '/dashboard/payments/payment-links' },
    { icon: DollarSign, label: 'Payouts', path: '/dashboard/payments' },
    { icon: Building, label: 'A/c Statement', path: '/dashboard/payments' },
  ];

  return (
    <div className="min-h-screen">
      {/* Top Summary Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-blue-100">Here's what's happening with your business today.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Recommended Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recommended</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {recommendedItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-3"
              >
                <div className="p-3 bg-blue-50 rounded-lg">
                  <item.icon className="text-blue-600" size={24} />
                </div>
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Business Overview */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Business Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Earnings Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center">
                  <ArrowUpRight size={14} />
                  +12.5%
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-2">Total Earnings</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">₹2,45,678</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Today</span>
                  <span className="text-sm font-semibold text-gray-900">₹12,340</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-sm font-semibold text-gray-900">₹56,780</span>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Wallet className="text-blue-600" size={24} />
                </div>
                <span className="text-xs text-blue-600 font-medium">Available</span>
              </div>
              <h3 className="text-sm text-gray-600 mb-2">Current Balance</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">₹1,89,456</p>
              <p className="text-xs text-gray-500">Ready to withdraw</p>
              
              <div className="mt-6">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                  Withdraw Funds
                </button>
              </div>
            </div>

            {/* Spends Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <CreditCard className="text-orange-600" size={24} />
                </div>
                <span className="text-xs text-orange-600 font-medium flex items-center">
                  <ArrowUpRight size={14} />
                  +8.3%
                </span>
              </div>
              <h3 className="text-sm text-gray-600 mb-2">Total Spends</h3>
              <p className="text-3xl font-bold text-gray-900 mb-1">₹45,890</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Processing Fees</span>
                  <span className="text-sm font-semibold text-gray-900">₹32,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Other Charges</span>
                  <span className="text-sm font-semibold text-gray-900">₹13,440</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">4,567</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Active Links</p>
              <p className="text-2xl font-bold text-gray-900">234</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">97.8%</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600 mb-1">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">₹3,456</p>
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Getting Started</h2>
              <p className="text-gray-600 mb-6">Complete these steps to unlock full potential of your account</p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2">
                <span>View Guide</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <BarChart3 className="text-gray-300" size={64} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
