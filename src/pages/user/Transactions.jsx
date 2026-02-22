import { useEffect, useState } from "react";
import { Search, Download, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { transactionAPI } from "../../utils/api";

const UserTransactions = () => {
  const { getUserId, getAuthHeader } = useAuth();
  const userId = getUserId() || sessionStorage.getItem("userId");

  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || txn.status === statusFilter;

    return matchesSearch && matchesStatus;
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
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

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
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Date & Time</th>
                <th className="px-6 py-3 text-left">Transaction ID</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(txn.createdAt || txn.date).toLocaleDateString('en-IN')} <br />
                      <span className="text-xs">{new Date(txn.createdAt || txn.date).toLocaleTimeString('en-IN')}</span>
                    </td>

                    <td className="px-6 py-4 text-sm font-mono font-medium text-blue-600">
                      {txn.transactionId || txn._id?.slice(-8)}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <p className="font-medium text-gray-800">{txn.description || txn.customerName || 'Transaction'}</p>
                      {txn.notes && <p className="text-xs text-gray-500 mt-1">{txn.notes}</p>}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${txn.type === "Credit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {txn.type === "Credit" ? "💰" : "💸"} {txn.type}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-4 text-sm font-bold ${txn.type === "Credit"
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {txn.type === "Credit" ? "+" : "-"}₹{(txn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full ${txn.status === "Completed" ||
                          txn.status === "Success"
                          ? "bg-green-100 text-green-800"
                          : txn.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {txn.status === "Completed" || txn.status === "Success" ? (
                          <CheckCircle size={14} />
                        ) : txn.status === "Pending" ? (
                          <Clock size={14} />
                        ) : (
                          <AlertCircle size={14} />
                        )}
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t text-sm text-gray-500">
          Total: {filteredTransactions.length} transactions
        </div>
      </div>
    </div>
  );
};

export default UserTransactions;
