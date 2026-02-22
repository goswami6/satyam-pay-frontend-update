import { TrendingUp, DollarSign, Users, Activity, ArrowUpRight, AlertCircle } from 'lucide-react';

const Overview = () => {
  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: '₹45,67,890', change: '+18.2%', color: 'green' },
    { icon: Activity, label: 'Total Transactions', value: '23,456', change: '+12.5%', color: 'blue' },
    { icon: Users, label: 'Active Users', value: '4,567', change: '+8.3%', color: 'purple' },
    { icon: AlertCircle, label: 'Failed Transactions', value: '234', change: '-5.2%', color: 'red' },
  ];

  const recentActivity = [
    { user: 'john@example.com', action: 'Payment received', amount: '₹5,670', time: '2 min ago' },
    { user: 'jane@example.com', action: 'Withdrawal processed', amount: '₹12,340', time: '5 min ago' },
    { user: 'mike@example.com', action: 'Subscription created', amount: '₹999', time: '10 min ago' },
    { user: 'sarah@example.com', action: 'Payment failed', amount: '₹3,450', time: '15 min ago' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back, Administrator</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div className={`p-2 sm:p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600 w-4 h-4 sm:w-6 sm:h-6`} />
              </div>
              <span className={`text-xs sm:text-sm font-medium flex items-center ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                <ArrowUpRight size={12} className="sm:w-[14px] sm:h-[14px]" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Recent Activity</h2>
          <div className="space-y-3 sm:space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 last:border-0">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                  <p className="text-xs text-gray-600">{activity.action}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900">{activity.amount}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">System Status</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-700">Payment Gateway</span>
              </div>
              <span className="text-xs sm:text-sm text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-700">Settlement System</span>
              </div>
              <span className="text-xs sm:text-sm text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-700">API Services</span>
              </div>
              <span className="text-xs sm:text-sm text-green-600 font-medium">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-xs sm:text-sm text-gray-700">Database</span>
              </div>
              <span className="text-xs sm:text-sm text-yellow-600 font-medium">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
