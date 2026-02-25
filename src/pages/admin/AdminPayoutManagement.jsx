import { useEffect, useState } from "react";
import { CheckCircle, XCircle, IndianRupee, AlertCircle, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { paymentAPI } from "../../utils/api";

const AdminPayoutManagement = () => {
  const { getAuthHeader } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await paymentAPI.getAdminWithdrawals();
      // Handle both array and object responses
      const data = Array.isArray(res.data) ? res.data : (res.data?.withdrawals || res.data?.data || []);
      setWithdrawals(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.response?.data?.message || "Failed to load withdrawal requests");
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await paymentAPI.approveWithdrawal(id);
      setSuccessMessage("✓ Payout approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchWithdrawals();
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.currentBalance !== undefined) {
        setError(`Insufficient Balance! User has ₹${errorData.currentBalance?.toFixed(2)} but requires ₹${errorData.required?.toFixed(2)}. Shortfall: ₹${errorData.shortfall?.toFixed(2)}`);
      } else {
        setError(errorData?.message || "Approval failed");
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(id);
      await paymentAPI.rejectWithdrawal(id);
      setSuccessMessage("✓ Payout rejected successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchWithdrawals();
    } catch (error) {
      setError(error.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  // Ensure withdrawals is always an array for safe filtering
  const withdrawalsArray = Array.isArray(withdrawals) ? withdrawals : [];
  const total = withdrawalsArray.length;
  const pending = withdrawalsArray.filter(w => w?.status === "Pending").length;
  const approved = withdrawalsArray.filter(w => w?.status === "Approved").length;
  const rejected = withdrawalsArray.filter(w => w?.status === "Rejected").length;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bulk Payouts Management
        </h1>
        <p className="text-gray-500 mt-1">
          Manage user payout requests from PayoutNow
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500 text-sm">Total Withdrawals</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>
        <div className="bg-yellow-50 p-6 rounded-xl border">
          <p className="text-yellow-600 text-sm">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-700">{pending}</h2>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border">
          <p className="text-green-600 text-sm">Approved</p>
          <h2 className="text-2xl font-bold text-green-700">{approved}</h2>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border">
          <p className="text-red-600 text-sm">Rejected</p>
          <h2 className="text-2xl font-bold text-red-700">{rejected}</h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Withdrawal ID</th>
                <th className="px-6 py-3 text-left font-semibold">Account Holder</th>
                <th className="px-6 py-3 text-left font-semibold">Amount</th>
                <th className="px-6 py-3 text-left font-semibold">Commission</th>
                <th className="px-6 py-3 text-left font-semibold">Total</th>
                <th className="px-6 py-3 text-left font-semibold">Account</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {withdrawalsArray.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    {loading ? "Loading..." : "No payout requests found"}
                  </td>
                </tr>
              ) : (
                withdrawalsArray.map((w) => (
                  <tr key={w._id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-blue-600">
                      {w.withdrawalId}
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">{w.accountName}</p>
                      <p className="text-xs text-gray-500">{w.userId?.email || "N/A"}</p>
                    </td>

                    <td className="px-6 py-4 font-semibold text-blue-600">
                      ₹{(w.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4 text-red-600 font-medium">
                      ₹{(w.commission || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4 font-bold text-indigo-600">
                      ₹{(w.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4 text-xs space-y-1">
                      <p className="font-medium text-gray-900">{w.accountNumber}</p>
                      <p className="text-gray-600">IFSC: {w.ifsc}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${w.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : w.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {w.status === "Approved" ? (
                          <CheckCircle size={14} />
                        ) : w.status === "Rejected" ? (
                          <XCircle size={14} />
                        ) : null}
                        {w.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(w.createdAt).toLocaleDateString('en-IN')} <br />
                      {new Date(w.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="px-6 py-4">
                      {w.status === "Pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(w._id)}
                            disabled={actionLoading === w._id}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors font-semibold"
                          >
                            {actionLoading === w._id ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle size={14} />
                            )}
                            Approve
                          </button>

                          <button
                            onClick={() => handleReject(w._id)}
                            disabled={actionLoading === w._id}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors font-semibold"
                          >
                            {actionLoading === w._id ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <XCircle size={14} />
                            )}
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPayoutManagement;
