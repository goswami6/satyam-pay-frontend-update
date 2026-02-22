import { Users, Plus, Search } from 'lucide-react';

const Customers = () => {
  const customers = [
    { id: 'CUST_001', name: 'John Doe', email: 'john@example.com', phone: '+91 98765 43210', orders: 23, totalSpent: '₹1,24,567', joined: '2025-11-15' },
    { id: 'CUST_002', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 98765 43211', orders: 45, totalSpent: '₹2,45,890', joined: '2025-10-20' },
    { id: 'CUST_003', name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 98765 43212', orders: 12, totalSpent: '₹67,450', joined: '2025-12-05' },
    { id: 'CUST_004', name: 'Sarah Williams', email: 'sarah@example.com', phone: '+91 98765 43213', orders: 67, totalSpent: '₹3,89,230', joined: '2025-09-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={18} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Customers</h3>
          <p className="text-2xl font-bold text-gray-800">4,567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Active This Month</h3>
          <p className="text-2xl font-bold text-green-600">2,345</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Avg. Order Value</h3>
          <p className="text-2xl font-bold text-blue-600">₹3,456</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Lifetime Value</h3>
          <p className="text-2xl font-bold text-gray-800">₹45,67,890</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">All Customers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{customer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{customer.totalSpent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{customer.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
