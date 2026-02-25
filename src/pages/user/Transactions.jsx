import { useEffect, useState } from "react";
import { Search, Download, AlertCircle, CheckCircle, Clock, Eye, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { transactionAPI } from "../../utils/api";

const UserTransactions = () => {
  const { getUserId, getAuthHeader } = useAuth();
  const userId = getUserId() || sessionStorage.getItem("userId");

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTxn, setSelectedTxn] = useState(null);

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

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Transactions</h1>
          <p className="text-gray-500">
            Showing {filteredTransactions.length} transactions from wallet & payments
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download size={18} />
          Export
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
        <div className="grid md:grid-cols-3 gap-4">
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold w-[120px]">Date</th>
                <th className="px-4 py-3 text-left font-semibold w-[130px]">Txn ID</th>
                <th className="px-4 py-3 text-left font-semibold w-[200px]">Description</th>
                <th className="px-4 py-3 text-center font-semibold w-[90px]">Category</th>
                <th className="px-4 py-3 text-center font-semibold w-[80px]">Method</th>
                <th className="px-4 py-3 text-center font-semibold w-[80px]">Type</th>
                <th className="px-4 py-3 text-right font-semibold w-[110px]">Amount</th>
                <th className="px-4 py-3 text-center font-semibold w-[100px]">Status</th>
                <th className="px-4 py-3 text-center font-semibold w-[60px]">View</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
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
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 capitalize min-w-[70px]">
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
                      <span className={`font-semibold text-sm ${txn.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                        {txn.type === "Credit" ? "+" : "-"}₹{(txn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedTxn(txn)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
          <span>Total: <strong>{filteredTransactions.length}</strong> transactions</span>
          <span className="text-xs text-gray-400">Scroll horizontally for more details →</span>
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

                <p className={`text-3xl font-bold ${selectedTxn.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                  {selectedTxn.type === "Credit" ? "+" : "-"}₹{(selectedTxn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-gray-500">{selectedTxn.type === "Credit" ? "Money Received" : "Money Sent"}</p>
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
                  <span className="text-sm font-medium text-gray-700 capitalize">{selectedTxn.category || 'Other'}</span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm font-medium text-gray-700 uppercase">{selectedTxn.method || 'N/A'}</span>
                </div>

                {selectedTxn.customerName && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Recipient</span>
                    <span className="text-sm font-medium text-gray-700">{selectedTxn.customerName}</span>
                  </div>
                )}

                {selectedTxn.fee > 0 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Fee</span>
                    <span className="text-sm font-medium text-red-600">-₹{selectedTxn.fee?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {selectedTxn.netAmount && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Net Amount</span>
                    <span className="text-sm font-medium text-gray-700">₹{selectedTxn.netAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
              </div>

              {/* Bank/UPI Details */}
              {(selectedTxn.accountNumber || selectedTxn.upiId) && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3">Payment Details</h4>
                  <div className="space-y-2">
                    {selectedTxn.accountNumber && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Account No.</span>
                        <span className="font-mono text-gray-800">****{selectedTxn.accountNumber?.slice(-4)}</span>
                      </div>
                    )}
                    {selectedTxn.ifscCode && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">IFSC</span>
                        <span className="font-mono text-gray-800">{selectedTxn.ifscCode}</span>
                      </div>
                    )}
                    {selectedTxn.bankName && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">Bank</span>
                        <span className="text-gray-800">{selectedTxn.bankName}</span>
                      </div>
                    )}
                    {selectedTxn.upiId && (
                      <div className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">UPI ID</span>
                        <span className="font-mono text-gray-800">{selectedTxn.upiId}</span>
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
            <div className="px-5 py-4 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={() => setSelectedTxn(null)}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
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
