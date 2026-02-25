import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Loader,
  Eye,
  User,
  Mail,
  Phone,
  Building2,
  Smartphone,
  Calendar,
  Filter,
  RefreshCw,
  X,
  IndianRupee,
  Send,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { payoutRequestAPI } from "../../utils/api";

const AdminPayoutRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("requested");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [fee, setFee] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = activeTab !== "all" ? { status: activeTab } : {};
      const response = await payoutRequestAPI.getAllRequests(params);
      setRequests(response.data.requests || []);
      setStats(response.data.stats || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setMessage({ type: "error", text: "Failed to load requests" });
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    if (!confirm("Are you sure you want to approve this payout request? Amount will be deducted from user's balance.")) return;
    try {
      setProcessing(true);
      await payoutRequestAPI.approveRequest(id, { fee });
      setMessage({ type: "success", text: "Payout request approved! Amount deducted from user balance." });
      setShowModal(false);
      fetchRequests();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to approve request",
      });
    } finally {
      setProcessing(false);
    }
  };

  const rejectRequest = async (id) => {
    if (!rejectReason.trim()) {
      setMessage({ type: "error", text: "Please enter rejection reason" });
      return;
    }
    try {
      setProcessing(true);
      await payoutRequestAPI.rejectRequest(id, { rejectionReason: rejectReason });
      setMessage({ type: "success", text: "Payout request rejected" });
      setShowModal(false);
      setRejectReason("");
      fetchRequests();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to reject request",
      });
    } finally {
      setProcessing(false);
    }
  };

  const completeRequest = async (id) => {
    try {
      setProcessing(true);
      await payoutRequestAPI.completeRequest(id, { transactionId });
      setMessage({ type: "success", text: "Payout marked as completed" });
      setShowModal(false);
      setTransactionId("");
      fetchRequests();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to complete request",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      requested: "bg-amber-100 text-amber-700",
      approved: "bg-emerald-100 text-emerald-700",
      rejected: "bg-red-100 text-red-700",
      processing: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };
    const icons = {
      requested: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
      processing: <Loader className="w-3 h-3 animate-spin" />,
      completed: <CheckCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />,
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatCount = (status) => {
    const stat = stats.find((s) => s._id === status);
    return stat?.count || 0;
  };

  const getStatAmount = (status) => {
    const stat = stats.find((s) => s._id === status);
    return stat?.totalAmount || 0;
  };

  const filteredRequests = requests.filter((req) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      req.vendorId?.name?.toLowerCase().includes(search) ||
      req.vendorId?.email?.toLowerCase().includes(search) ||
      req.vendorId?.phone?.includes(search) ||
      req.accountNumber?.includes(search) ||
      req.upiId?.toLowerCase().includes(search)
    );
  });

  const tabs = [
    { id: "requested", label: "Pending", count: getStatCount("requested") },
    { id: "approved", label: "Approved", count: getStatCount("approved") },
    { id: "completed", label: "Completed", count: getStatCount("completed") },
    { id: "rejected", label: "Rejected", count: getStatCount("rejected") },
    { id: "all", label: "All" },
  ];

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setFee(0);
    setRejectReason("");
    setTransactionId("");
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Payout Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage vendor payout requests
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Pending</span>
          </div>
          <p className="text-2xl font-black text-amber-800">{getStatCount("requested")}</p>
          <p className="text-xs text-amber-600">₹{getStatAmount("requested").toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Approved</span>
          </div>
          <p className="text-2xl font-black text-emerald-800">{getStatCount("approved")}</p>
          <p className="text-xs text-emerald-600">₹{getStatAmount("approved").toLocaleString()}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Completed</span>
          </div>
          <p className="text-2xl font-black text-green-800">{getStatCount("completed")}</p>
          <p className="text-xs text-green-600">₹{getStatAmount("completed").toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-red-700">Rejected</span>
          </div>
          <p className="text-2xl font-black text-red-800">{getStatCount("rejected")}</p>
          <p className="text-xs text-red-600">₹{getStatAmount("rejected").toLocaleString()}</p>
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl mb-6 flex items-center gap-3 ${message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-700 border border-red-200"
              }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="ml-auto p-1 hover:bg-white/50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Tabs & Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === tab.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="px-1.5 py-0.5 bg-white rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full md:w-64 focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-20">
            <Send className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No payout requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-6 py-4">
                    Vendor
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-6 py-4">
                    Amount
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-6 py-4">
                    Method
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-6 py-4">
                    Details
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-6 py-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-6 py-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase px-6 py-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {request.vendorId?.name || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {request.vendorId?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          ₹{request.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          Balance: ₹{request.vendorId?.balance?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {request.method === "bank" ? (
                          <Building2 className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Smartphone className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="text-sm text-slate-700 capitalize">
                          {request.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {request.method === "bank"
                          ? `A/C: ****${request.accountNumber?.slice(-4)}`
                          : request.upiId}
                      </p>
                      {request.method === "bank" && (
                        <p className="text-xs text-slate-500">{request.ifscCode}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700">
                        {formatDate(request.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openRequestModal(request)}
                        className="p-2 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Payout Request Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Amount & Status */}
              <div className="text-center mb-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                <p className="text-4xl font-black text-slate-800">
                  ₹{selectedRequest.amount.toLocaleString()}
                </p>
                <div className="mt-2">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              {/* Vendor Info */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Vendor Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Name:</span>
                    <span className="text-sm font-medium text-slate-700">
                      {selectedRequest.vendorId?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Email:</span>
                    <span className="text-sm font-medium text-slate-700">
                      {selectedRequest.vendorId?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Phone:</span>
                    <span className="text-sm font-medium text-slate-700">
                      {selectedRequest.vendorId?.phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Current Balance:</span>
                    <span className={`text-sm font-bold ${(selectedRequest.vendorId?.balance || 0) >= selectedRequest.amount
                        ? "text-emerald-600"
                        : "text-red-600"
                      }`}>
                      ₹{selectedRequest.vendorId?.balance?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  {selectedRequest.method === "bank" ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                  Payment Details ({selectedRequest.method === "bank" ? "Bank Transfer" : "UPI"})
                </h4>
                <div className="space-y-2">
                  {selectedRequest.method === "bank" ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Account Holder:</span>
                        <span className="text-sm font-medium text-slate-700">
                          {selectedRequest.accountHolderName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Account No:</span>
                        <span className="text-sm font-mono font-medium text-slate-700">
                          {selectedRequest.accountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">IFSC Code:</span>
                        <span className="text-sm font-mono font-medium text-slate-700">
                          {selectedRequest.ifscCode}
                        </span>
                      </div>
                      {selectedRequest.bankName && (
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">Bank Name:</span>
                          <span className="text-sm font-medium text-slate-700">
                            {selectedRequest.bankName}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">UPI ID:</span>
                      <span className="text-sm font-mono font-medium text-slate-700">
                        {selectedRequest.upiId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions for Pending */}
              {selectedRequest.status === "requested" && (
                <>
                  {/* Balance Check */}
                  {(selectedRequest.vendorId?.balance || 0) < selectedRequest.amount && (
                    <div className="bg-red-50 rounded-2xl p-4 mb-4 border border-red-100">
                      <p className="text-sm text-red-700 font-medium">
                        ⚠️ Insufficient vendor balance. Cannot approve this request.
                      </p>
                    </div>
                  )}

                  {/* Fee Setting */}
                  <div className="bg-amber-50 rounded-2xl p-4 mb-4">
                    <label className="text-sm font-bold text-amber-800 block mb-2">
                      Processing Fee (₹) - Optional
                    </label>
                    <input
                      type="number"
                      value={fee}
                      onChange={(e) => setFee(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl text-sm focus:border-amber-400 outline-none"
                      min={0}
                    />
                    <p className="text-xs text-amber-600 mt-2">
                      Total deduction: ₹{(selectedRequest.amount + fee).toLocaleString()}
                    </p>
                  </div>

                  {/* Reject Reason */}
                  <div className="mb-4">
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => rejectRequest(selectedRequest._id)}
                      disabled={processing}
                      className="flex-1 py-4 bg-red-600 text-white rounded-2xl text-sm font-bold hover:bg-red-700 disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                      {processing ? <Loader className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Reject
                    </button>
                    <button
                      onClick={() => approveRequest(selectedRequest._id)}
                      disabled={processing || (selectedRequest.vendorId?.balance || 0) < (selectedRequest.amount + fee)}
                      className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                      {processing ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Approve
                    </button>
                  </div>
                </>
              )}

              {/* Mark as Completed for Approved */}
              {selectedRequest.status === "approved" && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <p className="text-sm text-emerald-700 font-medium">
                      ✓ Amount deducted from vendor balance. Process the payout and mark as completed.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-700 block mb-2">
                      Transaction ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="Enter transaction reference ID"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    onClick={() => completeRequest(selectedRequest._id)}
                    disabled={processing}
                    className="w-full py-4 bg-green-600 text-white rounded-2xl text-sm font-bold hover:bg-green-700 disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Mark as Completed
                  </button>
                </div>
              )}

              {/* View-only for Completed */}
              {selectedRequest.status === "completed" && (
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <h4 className="text-sm font-bold text-green-700 mb-2">Completed</h4>
                  <div className="space-y-2">
                    {selectedRequest.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-green-600">Transaction ID:</span>
                        <span className="text-sm font-mono">{selectedRequest.transactionId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">Completed At:</span>
                      <span className="text-sm">{formatDate(selectedRequest.completedAt)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View-only for Rejected */}
              {selectedRequest.status === "rejected" && (
                <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                  <h4 className="text-sm font-bold text-red-700 mb-2">Rejected</h4>
                  <p className="text-sm text-red-600">{selectedRequest.rejectionReason}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Rejected at: {formatDate(selectedRequest.rejectedAt)}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors mt-4"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPayoutRequests;
