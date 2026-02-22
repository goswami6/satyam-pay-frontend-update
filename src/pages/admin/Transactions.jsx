import { useState } from 'react';
import { Filter, Download, Eye } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';

const Transactions = () => {
  const [filter, setFilter] = useState('all');

  const transactions = [
    { id: 'TXN_12345', user: 'john@example.com', amount: '₹5,670', status: 'Success', date: '2026-02-11 14:30', gateway: 'UPI' },
    { id: 'TXN_12346', user: 'jane@example.com', amount: '₹12,340', status: 'Success', date: '2026-02-11 13:15', gateway: 'Card' },
    { id: 'TXN_12347', user: 'mike@example.com', amount: '₹2,100', status: 'Pending', date: '2026-02-11 12:45', gateway: 'Net Banking' },
    { id: 'TXN_12348', user: 'sarah@example.com', amount: '₹8,900', status: 'Failed', date: '2026-02-11 11:20', gateway: 'Wallet' },
    { id: 'TXN_12349', user: 'tom@example.com', amount: '₹1,560', status: 'Success', date: '2026-02-11 10:05', gateway: 'UPI' },
    { id: 'TXN_12350', user: 'emma@example.com', amount: '₹22,000', status: 'Success', date: '2026-02-10 18:45', gateway: 'Card' },
  ];

  const columns = [
    { key: 'id', label: 'Transaction ID', className: 'text-sm font-medium text-blue-600' },
    { key: 'user', label: 'User', className: 'text-sm text-gray-900' },
    { 
      key: 'amount', 
      label: 'Amount', 
      render: (value) => <span className="text-sm font-semibold text-gray-900">{value}</span>
    },
    { key: 'gateway', label: 'Gateway', className: 'text-sm text-gray-600' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Success' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'date', label: 'Date & Time', className: 'text-sm text-gray-600' },
  ];

  const actions = (row) => (
    <>
      <button className="text-blue-600 hover:text-blue-800">
        <Eye size={16} />
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all payment transactions</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
          <Download size={18} />
          <span>Export</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Gateways</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Net Banking</option>
            <option>Wallet</option>
          </select>
          <input 
            type="date" 
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter size={18} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={transactions} actions={actions} />
    </div>
  );
};

export default Transactions;
