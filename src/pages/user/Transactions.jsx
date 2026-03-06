import { useEffect, useState } from "react";
import { Search, Download, AlertCircle, CheckCircle, Clock, Eye, X, Receipt, Send, Loader2, FileDown, Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { transactionAPI, API_URL } from "../../utils/api";
import API from "../../utils/api";

const UserTransactions = () => {
  const { getUserId, getAuthHeader } = useAuth();
  const userId = getUserId() || sessionStorage.getItem("userId");

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [receiptToast, setReceiptToast] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      const res = await transactionAPI.getTransactions(userId);

      setTransactions(res.data || []);
    } catch (error) {
      console.error("Transaction Fetch Error:", error);
      setError(error.response?.data?.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  // Request receipt function
  const requestReceipt = async (transactionId) => {
    try {
      setSendingReceipt(true);
      const res = await API.post(`/transactions/receipt/send/${transactionId}`);
      setReceiptToast({ message: res.data.message, type: 'success' });
      fetchTransactions();
      setTimeout(() => setReceiptToast(null), 4000);
    } catch (error) {
      setReceiptToast({
        message: error.response?.data?.message || 'Failed to send receipt',
        type: 'error'
      });
      setTimeout(() => setReceiptToast(null), 4000);
    } finally {
      setSendingReceipt(false);
    }
  };

  // Download receipt function
  const [downloadingReceipt, setDownloadingReceipt] = useState(null);

  const downloadReceipt = async (transactionId) => {
    try {
      setDownloadingReceipt(transactionId);
      const response = await fetch(`${API_URL}/transactions/receipt/download/${transactionId}`);

      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'Receipt.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=([^;]+)/);
        if (match) filename = match[1].replace(/"/g, '');
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setReceiptToast({ message: 'Receipt downloaded successfully!', type: 'success' });
      setTimeout(() => setReceiptToast(null), 3000);
    } catch (error) {
      console.error('Download error:', error);
      setReceiptToast({
        message: error.message || 'Failed to download receipt',
        type: 'error'
      });
      setTimeout(() => setReceiptToast(null), 4000);
    } finally {
      setDownloadingReceipt(null);
    }
  };

  // 🔎 Filtering
  const filteredTransactions = transactions.filter((txn) => {
    const name = txn.customerName || txn.description || "";

    const matchesSearch = name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
      (txn.transactionId || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || txn.status === statusFilter;

    const matchesType =
      typeFilter === "All" || txn.type === typeFilter;

    const matchesCategory =
      categoryFilter === "All" || txn.category === categoryFilter;

    // Date filter - compare only date parts to avoid timezone issues
    const matchesDateRange = (() => {
      if (!startDate && !endDate) return true;

      const txnDateStr = txn.createdAt || txn.date;
      if (!txnDateStr) return true;

      // Get date portion only (YYYY-MM-DD)
      const txnDateOnly = new Date(txnDateStr).toISOString().split('T')[0];

      if (startDate && endDate) {
        return txnDateOnly >= startDate && txnDateOnly <= endDate;
      } else if (startDate) {
        return txnDateOnly >= startDate;
      } else if (endDate) {
        return txnDateOnly <= endDate;
      }
      return true;
    })();

    return matchesSearch && matchesStatus && matchesType && matchesCategory && matchesDateRange;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, categoryFilter, startDate, endDate]);

  // Export to CSV function
  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = ['Date', 'Time', 'Transaction ID', 'Description', 'Category', 'Method', 'Type', 'Amount', 'Fee', 'Net Amount', 'Status', 'Bank Name', 'Account Number', 'IFSC Code', 'Notes'];

    const csvData = filteredTransactions.map(txn => [
      new Date(txn.createdAt || txn.date).toLocaleDateString('en-IN'),
      new Date(txn.createdAt || txn.date).toLocaleTimeString('en-IN'),
      txn.transactionId || txn._id,
      txn.description || txn.customerName || 'Transaction',
      txn.category || 'other',
      txn.method || 'N/A',
      txn.type,
      txn.amount || 0,
      txn.fee || 0,
      txn.netAmount || txn.amount || 0,
      txn.status,
      txn.bankName || '',
      txn.accountNumber || '',
      txn.ifscCode || '',
      txn.notes || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Receipt Toast */}
      {receiptToast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${receiptToast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          {receiptToast.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
          <span>{receiptToast.message}</span>
        </div>
      )}


      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Transactions</h1>
          <p className="text-gray-500">
            Showing {filteredTransactions.length} transactions from wallet & payments
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, description or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="All">All Categories</option>
            <option value="payout">Payout</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="deposit">Deposit</option>
            <option value="payment">Payment</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="All">All Types</option>
            <option value="Credit">Credit</option>
            <option value="Debit">Debit</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {/* Date Filter Row */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-600"
              placeholder="From Date"
            />
          </div>

          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-600"
              placeholder="To Date"
            />
          </div>

          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              Clear Date Filter
            </button>
          )}

          {(startDate || endDate) && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                {startDate && endDate
                  ? `${new Date(startDate).toLocaleDateString('en-IN')} - ${new Date(endDate).toLocaleDateString('en-IN')}`
                  : startDate
                    ? `From ${new Date(startDate).toLocaleDateString('en-IN')}`
                    : `Till ${new Date(endDate).toLocaleDateString('en-IN')}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Date</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Txn ID</th>
                <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">Description</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Category</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Method</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Type</th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">Amount</th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">Fee</th>
                <th className="px-3 py-3 text-right font-semibold whitespace-nowrap">Net Amount</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Status</th>
                <th className="px-3 py-3 text-center font-semibold whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((txn) => (
                  <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      <div>{new Date(txn.createdAt || txn.date).toLocaleDateString('en-IN')}</div>
                      <div className="text-xs text-gray-400">{new Date(txn.createdAt || txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {(txn.transactionId || txn._id)?.slice(-10)}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium text-gray-800 truncate max-w-[180px]" title={txn.description || txn.customerName || 'Transaction'}>
                        {txn.description || txn.customerName || 'Transaction'}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize min-w-[70px] ${txn.category === 'payout' ? 'bg-blue-100 text-blue-700' :
                        txn.category === 'withdrawal' ? 'bg-orange-100 text-orange-700' :
                          txn.category === 'deposit' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                        {txn.category || 'other'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-purple-50 text-purple-700 uppercase min-w-[50px]">
                        {txn.method || 'N/A'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded min-w-[60px] ${txn.type === "Credit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {txn.type}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold text-sm ${txn.type === "Credit" ? "text-green-600" : "text-gray-700"}`}>
                        ₹{(txn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {txn.fee && txn.fee > 0 ? (
                        <span className="font-medium text-sm text-red-500">
                          -₹{Number(txn.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className={`font-bold text-sm ${txn.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "Credit" ? "+" : "-"}₹{Number(txn.netAmount || txn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center gap-1 px-2 py-1 text-xs font-semibold rounded min-w-[80px] ${txn.status === "Completed" || txn.status === "Success"
                          ? "bg-green-100 text-green-700"
                          : txn.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {txn.status === "Completed" || txn.status === "Success" ? (
                          <CheckCircle size={12} />
                        ) : txn.status === "Pending" ? (
                          <Clock size={12} />
                        ) : (
                          <AlertCircle size={12} />
                        )}
                        {txn.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedTxn(txn)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {(txn.status === "Completed" || txn.status === "Success") ? (
                          <button
                            onClick={() => downloadReceipt(txn._id)}
                            disabled={downloadingReceipt === txn._id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200 disabled:opacity-50"
                            title="Download Receipt"
                          >
                            {downloadingReceipt === txn._id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <FileDown size={16} />
                            )}
                          </button>
                        ) : (
                          <span className="p-2 text-gray-300 rounded-lg border border-gray-100">
                            <FileDown size={16} />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with Pagination */}
        <div className="px-4 py-3 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredTransactions.length)}</strong> of <strong>{filteredTransactions.length}</strong></span>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-500'
                    }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[36px] px-3 py-1.5 text-sm rounded-lg border transition-colors ${currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-500'
                          }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-blue-500'
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-800">Transaction Details</h3>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">
              {/* Status & Amount Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 text-center space-y-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-full ${selectedTxn.status === "Completed" || selectedTxn.status === "Success"
                    ? "bg-green-100 text-green-700"
                    : selectedTxn.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {selectedTxn.status === "Completed" || selectedTxn.status === "Success" ? (
                    <CheckCircle size={16} />
                  ) : selectedTxn.status === "Pending" ? (
                    <Clock size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  {selectedTxn.status}
                </span>

                <div className="space-y-1">
                  <p className="text-sm text-gray-500">{selectedTxn.category === 'payout' ? 'Payout Amount' : selectedTxn.category === 'withdrawal' ? 'Withdrawal Amount' : 'Transaction Amount'}</p>
                  <p className={`text-3xl font-bold ${selectedTxn.type === "Credit" ? "text-green-600" : "text-gray-800"}`}>
                    ₹{Number(selectedTxn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {selectedTxn.fee && Number(selectedTxn.fee) > 0 && (
                  <div className="bg-red-50 rounded-lg p-3 mt-2">
                    <p className="text-xs text-red-600">Platform Fee</p>
                    <p className="text-lg font-bold text-red-600">-₹{Number(selectedTxn.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </div>
                )}

                {selectedTxn.netAmount && Number(selectedTxn.netAmount) !== Number(selectedTxn.amount) && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-600">Total Deducted from Wallet</p>
                    <p className={`text-xl font-bold ${selectedTxn.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                      {selectedTxn.type === "Credit" ? "+" : "-"}₹{Number(selectedTxn.netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>

              {/* Details Grid */}
              <div className="space-y-0">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Transaction ID</span>
                  <span className="font-mono text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{selectedTxn.transactionId || selectedTxn._id?.slice(-10)}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Date & Time</span>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(selectedTxn.createdAt || selectedTxn.date).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Description</span>
                  <span className="text-sm font-medium text-gray-700 text-right max-w-[180px] truncate" title={selectedTxn.description || 'N/A'}>
                    {selectedTxn.description || 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Category</span>
                  <span className={`text-sm font-medium capitalize px-2 py-0.5 rounded ${selectedTxn.category === 'payout' ? 'bg-blue-100 text-blue-700' :
                    selectedTxn.category === 'withdrawal' ? 'bg-orange-100 text-orange-700' :
                      selectedTxn.category === 'deposit' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>{selectedTxn.category || 'Other'}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm font-medium text-gray-700 uppercase">{selectedTxn.method || 'N/A'}</span>
                </div>

                {selectedTxn.customerName && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Beneficiary Name</span>
                    <span className="text-sm font-medium text-gray-700">{selectedTxn.customerName}</span>
                  </div>
                )}

                {selectedTxn.fee && selectedTxn.fee > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Platform Fee</span>
                    <span className="text-sm font-bold text-red-600">-₹{Number(selectedTxn.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {selectedTxn.netAmount && Number(selectedTxn.netAmount) !== Number(selectedTxn.amount) && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100 bg-yellow-50 -mx-5 px-5">
                    <span className="text-sm font-semibold text-gray-700">Total Deducted</span>
                    <span className="text-sm font-bold text-red-600">₹{Number(selectedTxn.netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              {/* Bank/UPI Details */}
              {(selectedTxn.accountNumber || selectedTxn.upiId) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">
                    {selectedTxn.category === 'payout' ? 'Payout Sent To' : selectedTxn.category === 'withdrawal' ? 'Withdrawal Account' : 'Payment Details'}
                  </h4>
                  <div className="space-y-2">
                    {selectedTxn.bankName && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Bank Name</span>
                        <span className="font-semibold text-gray-800">{selectedTxn.bankName}</span>
                      </div>
                    )}
                    {selectedTxn.accountNumber && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Account No.</span>
                        <span className="font-mono font-semibold text-gray-800">****{selectedTxn.accountNumber?.slice(-4)}</span>
                      </div>
                    )}
                    {selectedTxn.ifscCode && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">IFSC Code</span>
                        <span className="font-mono font-semibold text-gray-800">{selectedTxn.ifscCode}</span>
                      </div>
                    )}
                    {selectedTxn.upiId && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">UPI ID</span>
                        <span className="font-mono font-semibold text-gray-800">{selectedTxn.upiId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedTxn.notes && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700">{selectedTxn.notes}</p>
                </div>
              )}

              {/* Reference ID */}
              {selectedTxn.referenceId && (
                <div className="text-center">
                  <span className="text-xs text-gray-400">Ref: {selectedTxn.referenceId}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t bg-gray-50 rounded-b-xl space-y-3">
              {/* Receipt Buttons - Show for successful transactions */}
              {(selectedTxn.status === "Completed" || selectedTxn.status === "Success") && (
                <div className="grid grid-cols-2 gap-3">
                  {/* Download Receipt Button */}
                  <button
                    onClick={() => downloadReceipt(selectedTxn._id)}
                    disabled={downloadingReceipt === selectedTxn._id}
                    className="py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {downloadingReceipt === selectedTxn._id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <FileDown size={16} />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>

                  {/* Email Receipt Button */}
                  <button
                    onClick={() => requestReceipt(selectedTxn._id)}
                    disabled={sendingReceipt}
                    className="py-2.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {sendingReceipt ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Email Receipt</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Receipt sent info */}
              {selectedTxn.receiptGenerated && (
                <div className="flex items-center justify-center gap-2 text-green-600 text-xs">
                  <CheckCircle size={14} />
                  <span>Receipt sent to {selectedTxn.receiptSentTo}</span>
                </div>
              )}

              <button
                onClick={() => setSelectedTxn(null)}
                className="w-full py-2.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTransactions;
