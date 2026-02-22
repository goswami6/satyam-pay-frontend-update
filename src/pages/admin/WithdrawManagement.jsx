import { useEffect, useState, useCallback } from "react";
import {
  Loader,
  AlertCircle,
  CheckCircle,
  Building2,
  Check,
  X,
  Eye,
  Wallet,
  User,
  Hash,
  Clock,
  IndianRupee,
  Download
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { withdrawAPI } from "../../utils/api";

const WithdrawManagement = () => {
  const { getAuthHeader } = useAuth();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");

  // ✅ Fetch Withdrawals
  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await withdrawAPI.getAll("withdrawal");

      const data = Array.isArray(res.data) ? res.data : [];
      setWithdrawals(data);
      // console.log("✅ Withdrawals Loaded:", data);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load withdrawals");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  // ✅ Approve Withdrawal
  const approveWithdrawal = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await withdrawAPI.approve(id);

      setSuccessMessage("✓ Withdrawal approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchWithdrawals();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Reject Withdrawal
  const rejectWithdrawal = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await withdrawAPI.reject(id);

      setSuccessMessage("✓ Withdrawal rejected!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchWithdrawals();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ View Withdrawal Details
  const viewWithdrawal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowModal(true);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedWithdrawal(null);
  };

  // ✅ Safe Array Handling
  const withdrawalsArray = Array.isArray(withdrawals) ? withdrawals : [];

  // ✅ Filter Withdrawals
  const filteredWithdrawals = filter === "All"
    ? withdrawalsArray
    : withdrawalsArray.filter(w => w?.status === filter);

  const totalWithdrawals = withdrawalsArray.length;
  const pendingWithdrawals = withdrawalsArray.filter(w => w?.status === "Pending").length;
  const approvedWithdrawals = withdrawalsArray.filter(w => w?.status === "Approved").length;
  const rejectedWithdrawals = withdrawalsArray.filter(w => w?.status === "Rejected").length;

  const totalAmount = withdrawalsArray.reduce((sum, w) => sum + (w?.amount || 0), 0);
  const pendingAmount = withdrawalsArray.filter(w => w?.status === "Pending").reduce((sum, w) => sum + (w?.amount || 0), 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Withdraw Management</h1>
          <p className="text-gray-500">
            Review and process user withdrawal requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${filter === status
                ? "bg-white shadow text-gray-900"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <div className="bg-white p-5 rounded-xl shadow border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Total Requests</p>
              <p className="text-2xl font-bold text-slate-900">{totalWithdrawals}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-yellow-600 font-semibold">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{pendingWithdrawals}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-5 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-green-600 font-semibold">Approved</p>
              <p className="text-2xl font-bold text-green-700">{approvedWithdrawals}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-5 rounded-xl border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-red-600 font-semibold">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{rejectedWithdrawals}</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-semibold">Pending Amount</p>
              <p className="text-xl font-bold text-indigo-700">₹{pendingAmount.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : filteredWithdrawals.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No withdrawal requests found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-700">User</th>
                <th className="p-4 font-semibold text-gray-700">Bank Details</th>
                <th className="p-4 font-semibold text-gray-700">Amount</th>
                <th className="p-4 font-semibold text-gray-700">Commission</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Requested</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="border-t hover:bg-gray-50 transition-colors">

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{withdrawal.userId?.fullName || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{withdrawal.userId?.email || "N/A"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{withdrawal.accountName}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        ••••{withdrawal.accountNumber?.slice(-4)} • {withdrawal.ifsc}
                      </p>
                    </div>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-gray-900 text-lg">₹{(withdrawal.amount || 0).toLocaleString('en-IN')}</p>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded font-semibold">
                      ₹{(withdrawal.commission || 0).toFixed(2)}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold inline-block ${withdrawal.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : withdrawal.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {withdrawal.status || "Pending"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600 text-xs">
                    {withdrawal.createdAt && (
                      <>
                        {new Date(withdrawal.createdAt).toLocaleDateString("en-IN")}
                        <br />
                        {new Date(withdrawal.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      {/* View Button */}
                      <button
                        onClick={() => viewWithdrawal(withdrawal)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>

                      {withdrawal.status === "Pending" && (
                        <>
                          <button
                            onClick={() => approveWithdrawal(withdrawal._id)}
                            disabled={actionLoading === withdrawal._id}
                            className="text-green-600 hover:text-green-800 disabled:text-green-300 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            title="Approve"
                          >
                            {actionLoading === withdrawal._id ? (
                              <Loader size={18} className="animate-spin" />
                            ) : (
                              <Check size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => rejectWithdrawal(withdrawal._id)}
                            disabled={actionLoading === withdrawal._id}
                            className="text-red-600 hover:text-red-800 disabled:text-red-300 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            {actionLoading === withdrawal._id ? (
                              <Loader size={18} className="animate-spin" />
                            ) : (
                              <X size={18} />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Withdrawal Details</h2>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {selectedWithdrawal.withdrawalId}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">

              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
                <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{selectedWithdrawal.userId?.fullName}</p>
                  <p className="text-sm text-gray-500">{selectedWithdrawal.userId?.email}</p>
                </div>
              </div>

              {/* Amount Details */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Amount</p>
                  <p className="text-xl font-bold text-gray-900">₹{selectedWithdrawal.amount}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-orange-600 font-semibold mb-1">Commission</p>
                  <p className="text-xl font-bold text-orange-700">₹{selectedWithdrawal.commission?.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl text-center">
                  <p className="text-xs text-green-600 font-semibold mb-1">Total</p>
                  <p className="text-xl font-bold text-green-700">₹{selectedWithdrawal.total?.toFixed(2)}</p>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Bank Account</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Account Name</span>
                    <span className="font-semibold">{selectedWithdrawal.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">Account Number</span>
                    <span className="font-mono font-semibold">{selectedWithdrawal.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-sm">IFSC Code</span>
                    <span className="font-mono font-semibold">{selectedWithdrawal.ifsc}</span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-4 py-2 text-sm rounded-full font-bold ${selectedWithdrawal.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  selectedWithdrawal.status === "Approved" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                  {selectedWithdrawal.status}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              {selectedWithdrawal.status === "Pending" && (
                <>
                  <button
                    onClick={() => { approveWithdrawal(selectedWithdrawal._id); closeModal(); }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { rejectWithdrawal(selectedWithdrawal._id); closeModal(); }}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WithdrawManagement;
