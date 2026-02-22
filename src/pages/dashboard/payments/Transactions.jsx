import { Search, Filter, Download } from 'lucide-react';

const Transactions = () => {
  const transactions = [
    { id: 'TXN_12345', customer: 'Alice Johnson', email: 'alice@example.com', amount: '₹5,450', method: 'UPI', status: 'Success', date: '2026-02-11 14:30' },
    { id: 'TXN_12346', customer: 'Bob Smith', email: 'bob@example.com', amount: '₹12,340', method: 'Card', status: 'Success', date: '2026-02-11 13:15' },
    { id: 'TXN_12347', customer: 'Carol White', email: 'carol@example.com', amount: '₹2,100', method: 'Net Banking', status: 'Pending', date: '2026-02-11 12:45' },
    { id: 'TXN_12348', customer: 'David Brown', email: 'david@example.com', amount: '₹8,900', method: 'Wallet', status: 'Success', date: '2026-02-11 11:20' },
    { id: 'TXN_12349', customer: 'Emma Davis', email: 'emma@example.com', amount: '₹1,560', method: 'UPI', status: 'Failed', date: '2026-02-11 10:05' },
    { id: 'TXN_12350', customer: 'Frank Miller', email: 'frank@example.com', amount: '₹22,000', method: 'Card', status: 'Success', date: '2026-02-10 18:45' },
    { id: 'TXN_12351', customer: 'Grace Lee', email: 'grace@example.com', amount: '₹4,320', method: 'UPI', status: 'Success', date: '2026-02-10 16:30' },
    { id: 'TXN_12352', customer: 'Henry Wilson', email: 'henry@example.com', amount: '₹7,890', method: 'Net Banking', status: 'Pending', date: '2026-02-10 14:15' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by transaction ID, customer name, email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {txn.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{txn.customer}</div>
                    <div className="text-sm text-gray-500">{txn.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {txn.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {txn.method}
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

export default Transactions;
