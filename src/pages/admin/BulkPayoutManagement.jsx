import { useEffect, useState, useCallback } from "react";
import {
  Loader,
  AlertCircle,
  CheckCircle,
  FileSpreadsheet,
  Trash2,
  Check,
  X,
  Eye,
  Download
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { bulkPayoutAPI } from "../../utils/api";

const BulkPayoutManagement = () => {
  const { getAuthHeader } = useAuth();

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch Payouts
  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await bulkPayoutAPI.getAll();

      const data = Array.isArray(res.data) ? res.data : [];
      setPayouts(data);
      // console.log("✅ Bulk Payouts Loaded:", data);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load payouts");
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  // ✅ Approve Payout
  const approvePayout = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await bulkPayoutAPI.approve(id);

      setSuccessMessage("✓ Bulk payout approved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchPayouts();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Reject Payout
  const rejectPayout = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await bulkPayoutAPI.reject(id);

      setSuccessMessage("✓ Bulk payout rejected!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchPayouts();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ View Payout Details
  const viewPayout = (payout) => {
    setSelectedPayout(payout);
    setShowModal(true);
  };

  // ✅ Close Modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPayout(null);
  };

  // ✅ Download CSV File
  const downloadPayoutCSV = async (payoutId, fileName) => {
    try {
      const response = await bulkPayoutAPI.download(payoutId);

      // Check if response is JSON error (blob type check)
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const json = JSON.parse(text);
        setError(json.message || "Download failed");
        return;
      }

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'bulk_payout.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download Error:", err);
      // Handle error response
      if (err.response?.data) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          setError(json.message || "Failed to download file");
        } catch {
          setError("No data available for this file. Only new uploads will have downloadable data.");
        }
      } else {
        setError("Failed to download file");
      }
      setTimeout(() => setError(""), 5000);
    }
  };

  // ✅ Safe Array Handling
  const payoutsArray = Array.isArray(payouts) ? payouts : [];

  const totalPayouts = payoutsArray.length;
  const pendingPayouts = payoutsArray.filter(p => p?.status === "Pending").length;
  const approvedPayouts = payoutsArray.filter(p => p?.status === "Approved").length;
  const rejectedPayouts = payoutsArray.filter(p => p?.status === "Rejected").length;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Bulk Payout Management</h1>
        <p className="text-gray-500">
          Review and approve bulk file uploads from users
        </p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-sm text-gray-600 font-semibold">Total Uploads</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalPayouts}</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h3 className="text-sm text-yellow-600 font-semibold">Pending</h3>
          <p className="text-3xl font-bold text-yellow-700 mt-2">{pendingPayouts}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-sm text-green-600 font-semibold">Approved</h3>
          <p className="text-3xl font-bold text-green-700 mt-2">{approvedPayouts}</p>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-sm text-red-600 font-semibold">Rejected</h3>
          <p className="text-3xl font-bold text-red-700 mt-2">{rejectedPayouts}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : payoutsArray.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No bulk payouts found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-700">File Name</th>
                <th className="p-4 font-semibold text-gray-700">User</th>
                <th className="p-4 font-semibold text-gray-700">Total Rows</th>
                <th className="p-4 font-semibold text-gray-700">Total Amount</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Uploaded</th>
                <th className="p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {payoutsArray.map((payout) => (
                <tr key={payout._id} className="border-t hover:bg-gray-50 transition-colors">

                  <td className="p-4">
                    <button
                      onClick={() => downloadPayoutCSV(payout._id, payout.fileName)}
                      className="flex items-center gap-3 hover:text-blue-600 transition-colors group"
                      title="Click to download file"
                    >
                      <FileSpreadsheet size={16} className="text-green-500 group-hover:text-blue-600" />
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 underline decoration-dotted">
                        {payout.fileName || "N/A"}
                      </span>
                      <Download size={14} className="text-gray-400 group-hover:text-blue-600" />
                    </button>
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-900">{payout.userId?.fullName || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{payout.userId?.email || "N/A"}</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                      {payout.totalRows || 0}
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-gray-900">₹{(payout.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold inline-block ${payout.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : payout.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {payout.status || "Pending"}
                    </span>
                  </td>

                  <td className="p-4 text-gray-600 text-xs">
                    {payout.createdAt && (
                      <>
                        {new Date(payout.createdAt).toLocaleDateString("en-IN")}
                        <br />
                        {new Date(payout.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                  </td>

                  <td className="p-4 flex gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => viewPayout(payout)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>

                    {payout.status === "Pending" && (
                      <>
                        <button
                          onClick={() => approvePayout(payout._id)}
                          disabled={actionLoading === payout._id}
                          className="text-green-600 hover:text-green-800 disabled:text-green-300 p-1 rounded hover:bg-green-50"
                          title="Approve"
                        >
                          {actionLoading === payout._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Check size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => rejectPayout(payout._id)}
                          disabled={actionLoading === payout._id}
                          className="text-red-600 hover:text-red-800 disabled:text-red-300 p-1 rounded hover:bg-red-50"
                          title="Reject"
                        >
                          {actionLoading === payout._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
                        </button>
                      </>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Payout Details</h2>
                <button
                  onClick={() => downloadPayoutCSV(selectedPayout._id, selectedPayout.fileName)}
                  className="text-sm text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1 hover:underline"
                >
                  <FileSpreadsheet className="inline w-4 h-4" />
                  {selectedPayout.fileName}
                  <Download size={14} />
                </button>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Info */}
            <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Rows</p>
                  <p className="text-lg font-bold text-gray-900">{selectedPayout.totalRows}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Amount</p>
                  <p className="text-lg font-bold text-green-600">₹{selectedPayout.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold inline-block mt-1 ${selectedPayout.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                    selectedPayout.status === "Approved" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                    {selectedPayout.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">User</p>
                  <p className="text-sm font-medium text-gray-900">{selectedPayout.userId?.fullName || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Payout Data Table */}
            <div className="overflow-auto max-h-[50vh]">
              {selectedPayout.payoutData && selectedPayout.payoutData.length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-3 text-left font-semibold text-gray-700">#</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Account Holder</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Account Number</th>
                      <th className="p-3 text-left font-semibold text-gray-700">IFSC</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Bank Name</th>
                      <th className="p-3 text-right font-semibold text-gray-700">Amount</th>
                      <th className="p-3 text-center font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayout.payoutData.map((row, index) => (
                      <tr key={row._id || index} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-gray-500">{index + 1}</td>
                        <td className="p-3 font-medium text-gray-900">{row.accountHolderName}</td>
                        <td className="p-3 text-gray-600 font-mono text-xs">{row.accountNumber}</td>
                        <td className="p-3 text-gray-600 font-mono text-xs">{row.ifsc}</td>
                        <td className="p-3 text-gray-600">{row.bankName}</td>
                        <td className="p-3 text-right font-bold text-gray-900">₹{row.amount?.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 text-xs rounded-full font-semibold ${row.status === "Completed" ? "bg-green-100 text-green-800" :
                            row.status === "Failed" ? "bg-red-100 text-red-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                            {row.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>No payout data available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              {selectedPayout.status === "Pending" && (
                <>
                  <button
                    onClick={() => { approvePayout(selectedPayout._id); closeModal(); }}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Approve All
                  </button>
                  <button
                    onClick={() => { rejectPayout(selectedPayout._id); closeModal(); }}
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

export default BulkPayoutManagement;
