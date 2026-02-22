import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';

const Home = () => {
  const stats = [
    { icon: DollarSign, label: 'Total Revenue', value: '₹2,45,678', change: '+12.5%', color: 'blue' },
    { icon: Activity, label: 'Transactions', value: '1,234', change: '+8.2%', color: 'green' },
    { icon: Users, label: 'Active Users', value: '456', change: '+23.1%', color: 'purple' },
    { icon: TrendingUp, label: 'Growth', value: '32.5%', change: '+5.4%', color: 'orange' },
  ];

  const recentTransactions = [
    { id: 'TXN_001', customer: 'John Doe', amount: '₹1,250', status: 'Success', date: '2026-02-11' },
    { id: 'TXN_002', customer: 'Jane Smith', amount: '₹3,400', status: 'Success', date: '2026-02-11' },
    { id: 'TXN_003', customer: 'Mike Johnson', amount: '₹890', status: 'Pending', date: '2026-02-10' },
    { id: 'TXN_004', customer: 'Sarah Williams', amount: '₹2,100', status: 'Success', date: '2026-02-10' },
    { id: 'TXN_005', customer: 'Tom Brown', amount: '₹560', status: 'Failed', date: '2026-02-09' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
              <span className="text-sm text-green-600 font-medium">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {txn.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {txn.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {txn.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      txn.status === 'Success' ? 'bg-green-100 text-green-800' :
                      txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {txn.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
