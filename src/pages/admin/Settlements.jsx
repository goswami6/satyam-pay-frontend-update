import { Download, Eye } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';

const Settlements = () => {
  const settlements = [
    { id: 'SET_001', user: 'john@example.com', amount: '₹45,670', transactions: 23, status: 'Completed', date: '2026-02-10' },
    { id: 'SET_002', user: 'jane@example.com', amount: '₹32,100', transactions: 15, status: 'Completed', date: '2026-02-09' },
    { id: 'SET_003', user: 'mike@example.com', amount: '₹58,920', transactions: 31, status: 'Processing', date: '2026-02-08' },
    { id: 'SET_004', user: 'sarah@example.com', amount: '₹21,450', transactions: 12, status: 'Pending', date: '2026-02-07' },
    { id: 'SET_005', user: 'tom@example.com', amount: '₹67,890', transactions: 42, status: 'Completed', date: '2026-02-06' },
  ];

  const columns = [
    { key: 'id', label: 'Settlement ID', className: 'text-sm font-medium text-blue-600' },
    { key: 'user', label: 'User', className: 'text-sm text-gray-900' },
    { 
      key: 'amount', 
      label: 'Amount', 
      render: (value) => <span className="text-sm font-semibold text-gray-900">{value}</span>
    },
    { key: 'transactions', label: 'Transactions', className: 'text-sm text-gray-600' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'Processing' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'date', label: 'Date', className: 'text-sm text-gray-600' },
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
          <h1 className="text-3xl font-bold text-gray-900">All Settlements</h1>
          <p className="text-gray-600 mt-1">Monitor settlement processing and history</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2">
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Settled</h3>
          <p className="text-2xl font-bold text-gray-900">₹2,25,030</p>
          <p className="text-sm text-green-600 mt-1">Last 7 days</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Processing</h3>
          <p className="text-2xl font-bold text-gray-900">₹58,920</p>
          <p className="text-sm text-blue-600 mt-1">In progress</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Pending</h3>
          <p className="text-2xl font-bold text-gray-900">₹21,450</p>
          <p className="text-sm text-yellow-600 mt-1">Awaiting approval</p>
        </div>
      </div>

      <DataTable columns={columns} data={settlements} actions={actions} />
    </div>
  );
};

export default Settlements;
