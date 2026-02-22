import { RotateCw, Plus } from 'lucide-react';

const Subscription = () => {
  const subscriptions = [
    { id: 'SUB_001', plan: 'Premium Monthly', customer: 'John Doe', amount: '₹999', status: 'Active', nextBilling: '2026-03-11' },
    { id: 'SUB_002', plan: 'Basic Annual', customer: 'Jane Smith', amount: '₹5,999', status: 'Active', nextBilling: '2027-01-15' },
    { id: 'SUB_003', plan: 'Pro Monthly', customer: 'Mike Johnson', amount: '₹1,999', status: 'Paused', nextBilling: '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Subscriptions</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={18} />
          <span>Create Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Active Subscriptions</h3>
          <p className="text-2xl font-bold text-gray-800">567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Monthly Recurring</h3>
          <p className="text-2xl font-bold text-green-600">₹8,45,670</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Churn Rate</h3>
          <p className="text-2xl font-bold text-orange-600">2.3%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Plans</h3>
          <p className="text-2xl font-bold text-blue-600">12</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Subscriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Billing</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{sub.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{sub.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sub.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.nextBilling}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
