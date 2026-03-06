import { useState, useEffect } from 'react';
import { Filter, Download, Eye, Receipt, Send, CheckCircle, Clock, X, Loader2, Calendar } from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import API from '../../utils/api';

const Transactions = () => {
  const [filter, setFilter] = useState('all');
  const [gatewayFilter, setGatewayFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReceipt, setSendingReceipt] = useState(null);
  const [receiptModal, setReceiptModal] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/transactions/admin/all');
      setTransactions(res.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const sendReceipt = async (transactionId, email = null) => {
    try {
      setSendingReceipt(transactionId);
      const res = await API.post(`/transactions/receipt/send/${transactionId}`, { email });
      showToast(res.data.message, 'success');
      fetchTransactions();
      setReceiptModal(null);
      setCustomEmail('');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send receipt', 'error');
    } finally {
      setSendingReceipt(null);
    }
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.status?.toLowerCase() !== filter.toLowerCase()) return false;
    if (gatewayFilter !== 'all' && t.method?.toLowerCase() !== gatewayFilter.toLowerCase()) return false;

    // Date filter - compare only date parts
    if (startDate || endDate) {
      const txnDateStr = t.createdAt;
      if (!txnDateStr) return true;

      const txnDateOnly = new Date(txnDateStr).toISOString().split('T')[0];

      if (startDate && endDate) {
        if (txnDateOnly < startDate || txnDateOnly > endDate) return false;
      } else if (startDate) {
        if (txnDateOnly < startDate) return false;
      } else if (endDate) {
        if (txnDateOnly > endDate) return false;
      }
    }

    return true;
  });

  const tableData = filteredTransactions.map(t => ({
    _id: t._id,
    id: t.transactionId || t._id?.slice(-8),
    user: t.userId?.email || t.customerEmail || 'N/A',
    userName: t.userId?.fullName || t.customerName || 'N/A',
    amount: formatAmount(t.amount),
    rawAmount: t.amount,
    gateway: t.method?.toUpperCase() || 'N/A',
    status: t.status || 'Pending',
    date: formatDate(t.createdAt),
    receiptSent: t.receiptGenerated,
    receiptNumber: t.receiptNumber,
    receiptSentAt: t.receiptSentAt,
    receiptSentTo: t.receiptSentTo,
  }));

  const columns = [
    { key: 'id', label: 'Transaction ID', className: 'text-sm font-medium text-blue-600' },
    {
      key: 'user',
      label: 'User',
      render: (value, row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.userName}</p>
          <p className="text-xs text-gray-500">{value}</p>
        </div>
      )
    },
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
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${value === 'Success' || value === 'Completed' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
          {value}
        </span>
      )
    },
    { key: 'date', label: 'Date & Time', className: 'text-sm text-gray-600' },
    {
      key: 'receiptSent',
      label: 'Receipt',
      render: (value, row) => (
        value ? (
          <div className="flex items-center gap-1">
            <CheckCircle size={14} className="text-green-500" />
            <span className="text-xs text-green-600">Sent</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-gray-400" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
        )
      )
    },
  ];

  const actions = (row) => (
    <div className="flex items-center gap-2">
      <button
        className="text-blue-600 hover:text-blue-800 p-1"
        title="View Details"
      >
        <Eye size={16} />
      </button>
      {(row.status === 'Success' || row.status === 'Completed') && (
        <button
          className={`p-1 ${row.receiptSent ? 'text-green-600 hover:text-green-800' : 'text-purple-600 hover:text-purple-800'}`}
          title={row.receiptSent ? 'Resend Receipt' : 'Send Receipt'}
          onClick={() => setReceiptModal(row)}
          disabled={sendingReceipt === row._id}
        >
          {sendingReceipt === row._id ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Receipt size={16} />
          )}
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Payment Receipt</h3>
              <button
                onClick={() => { setReceiptModal(null); setCustomEmail(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="text-sm font-medium text-blue-600">{receiptModal.id}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-semibold text-gray-900">{receiptModal.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User</span>
                  <span className="text-sm text-gray-900">{receiptModal.user}</span>
                </div>
              </div>

              {receiptModal.receiptSent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">Receipt already sent</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    Sent to: {receiptModal.receiptSentTo} on {formatDate(receiptModal.receiptSentAt)}
                  </p>
                  {receiptModal.receiptNumber && (
                    <p className="text-xs text-green-600">Receipt #: {receiptModal.receiptNumber}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send to email (optional)
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder={receiptModal.user}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to send to user&apos;s registered email
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setReceiptModal(null); setCustomEmail(''); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => sendReceipt(receiptModal._id, customEmail || null)}
                  disabled={sendingReceipt === receiptModal._id}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {sendingReceipt === receiptModal._id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{receiptModal.receiptSent ? 'Resend Receipt' : 'Send Receipt'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={gatewayFilter}
            onChange={(e) => setGatewayFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Gateways</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="netbanking">Net Banking</option>
            <option value="wallet">Wallet</option>
          </select>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From Date"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To Date"
            />
          </div>
          {(startDate || endDate) && (
            <button
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2"
            >
              <X size={16} />
              <span>Clear Dates</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading transactions...</span>
        </div>
      ) : tableData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Receipt size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
          <p className="text-gray-600 mt-1">Transactions will appear here once payments are made</p>
        </div>
      ) : (
        <DataTable columns={columns} data={tableData} actions={actions} />
      )}
    </div>
  );
};

export default Transactions;
