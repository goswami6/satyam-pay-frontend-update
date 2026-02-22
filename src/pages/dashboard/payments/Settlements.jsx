import { Calendar, Download } from 'lucide-react';

const Settlements = () => {
  const settlements = [
    { id: 'SET_001', amount: '₹45,670', transactions: 23, fee: '₹456', net: '₹45,214', status: 'Completed', date: '2026-02-10', utr: 'UTR123456789' },
    { id: 'SET_002', amount: '₹32,100', transactions: 15, fee: '₹321', net: '₹31,779', status: 'Completed', date: '2026-02-09', utr: 'UTR987654321' },
    { id: 'SET_003', amount: '₹58,920', transactions: 31, fee: '₹589', net: '₹58,331', status: 'Processing', date: '2026-02-08', utr: '-' },
    { id: 'SET_004', amount: '₹21,450', transactions: 12, fee: '₹215', net: '₹21,235', status: 'Completed', date: '2026-02-07', utr: 'UTR456789123' },
    { id: 'SET_005', amount: '₹67,890', transactions: 42, fee: '₹679', net: '₹67,211', status: 'Completed', date: '2026-02-06', utr: 'UTR789123456' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Settlements</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Settled</h3>
          <p className="text-2xl font-bold text-gray-800">₹2,25,030</p>
          <p className="text-sm text-green-600 mt-1">Last 7 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Processing</h3>
          <p className="text-2xl font-bold text-gray-800">₹58,920</p>
          <p className="text-sm text-yellow-600 mt-1">Expected in 1-2 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Transactions</h3>
          <p className="text-2xl font-bold text-gray-800">123</p>
          <p className="text-sm text-gray-600 mt-1">Settled this week</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg">
            <Calendar size={18} className="text-gray-400" />
            <select className="bg-transparent focus:outline-none text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom Range</option>
            </select>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm">
            <option>All Status</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Settlement ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gross Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UTR
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {settlement.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                    {settlement.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {settlement.transactions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    {settlement.fee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {settlement.net}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      settlement.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      settlement.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {settlement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {settlement.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {settlement.utr}
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

export default Settlements;
