import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  Building2,
  CreditCard,
  Smartphone,
  RefreshCw,
  X,
  AlertCircle,
  Eye,
  Ban,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { payoutRequestAPI, userAPI } from "../../utils/api";

const RequestPayout = () => {
  const { user } = useAuth();
  const [currentBalance, setCurrentBalance] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state
  const [formData, setFormData] = useState({
    amount: "",
    method: "bank",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: "",
    upiId: "",
  });

  useEffect(() => {
    fetchRequests();
    fetchBalance();
  }, [activeTab]);

  const fetchBalance = async () => {
    try {
      if (user?._id) {
        const response = await userAPI.getBalance(user._id);
        setCurrentBalance(response.data.balance || 0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setCurrentBalance(user?.balance || 0);
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = activeTab !== "all" ? { status: activeTab } : {};
      const response = await payoutRequestAPI.getMyRequests(params);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setMessage({ type: "error", text: "Failed to load requests" });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setMessage({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    if (parseFloat(formData.amount) > (currentBalance || user?.balance || 0)) {
      setMessage({ type: "error", text: "Insufficient balance" });
      return;
    }

    if (formData.method === "bank") {
      if (!formData.accountNumber || !formData.ifscCode || !formData.accountHolderName) {
        setMessage({ type: "error", text: "Please fill all bank details" });
        return;
      }
      if (formData.accountNumber !== formData.confirmAccountNumber) {
        setMessage({ type: "error", text: "Account numbers do not match" });
        return;
      }
    } else if (formData.method === "upi") {
      if (!formData.upiId) {
        setMessage({ type: "error", text: "Please enter UPI ID" });
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload = {
        amount: parseFloat(formData.amount),
        method: formData.method,
        ...(formData.method === "bank" && {
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase(),
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
        }),
        ...(formData.method === "upi" && {
          upiId: formData.upiId,
        }),
      };

      await payoutRequestAPI.createRequest(payload);
      setMessage({ type: "success", text: "Payout request submitted! Waiting for admin approval." });
      setFormData({
        amount: "",
        method: "bank",
        accountNumber: "",
        confirmAccountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
        upiId: "",
      });
      fetchRequests();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to submit request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (id) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await payoutRequestAPI.cancelRequest(id);
      setMessage({ type: "success", text: "Request cancelled" });
      fetchRequests();
      setShowModal(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to cancel request",
      });
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

  const tabs = [
    { id: "all", label: "All" },
    { id: "requested", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-800">Request Payout</h1>
        <p className="text-sm text-slate-500 mt-1">
          Request payouts to your bank account or UPI
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm">Available Balance</p>
            <p className="text-3xl font-black mt-1">₹{(currentBalance || user?.balance || 0).toFixed(2)}</p>
          </div>
          <button
            onClick={fetchBalance}
            className="p-3 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
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
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Request Form */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" />
            New Payout Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  min="1"
                  max={currentBalance || user?.balance || 0}
                />
              </div>
            </div>

            {/* Method Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">
                Payout Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, method: "bank" }))}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.method === "bank"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <Building2 className="w-6 h-6" />
                  <span className="text-sm font-medium">Bank Transfer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, method: "upi" }))}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.method === "upi"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-medium">UPI</span>
                </button>
              </div>
            </div>

            {/* Bank Details */}
            {formData.method === "bank" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    placeholder="Enter account holder name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter account number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-2">
                    Confirm Account Number
                  </label>
                  <input
                    type="text"
                    name="confirmAccountNumber"
                    value={formData.confirmAccountNumber}
                    onChange={handleInputChange}
                    placeholder="Re-enter account number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="IFSC Code"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-2">
                      Bank Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Bank name"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* UPI Details */}
            {formData.method === "upi" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="text-sm font-medium text-slate-700 block mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-colors"
                />
              </motion.div>
            )}

            {/* Info Banner */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700">
                  <p className="font-medium">Important:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
                    <li>Amount will be deducted only after admin approval</li>
                    <li>Verify all details before submitting</li>
                    <li>Processing may take 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl text-sm font-bold hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Request History */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Request History
            </h2>
            <button
              onClick={fetchRequests}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Request List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No requests found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {requests.map((request) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {request.method === "bank" ? (
                        <Building2 className="w-4 h-4 text-slate-500" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-slate-500" />
                      )}
                      <span className="text-sm font-bold text-slate-800">
                        ₹{request.amount.toLocaleString()}
                      </span>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      {request.method === "bank"
                        ? `A/C: ****${request.accountNumber?.slice(-4)}`
                        : `UPI: ${request.upiId}`}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {formatDate(request.createdAt)}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Request Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Amount & Status */}
              <div className="text-center mb-6">
                <p className="text-4xl font-black text-slate-800">
                  ₹{selectedRequest.amount.toLocaleString()}
                </p>
                <div className="mt-2">{getStatusBadge(selectedRequest.status)}</div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Payment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Method:</span>
                      <span className="text-sm font-medium text-slate-700">
                        {selectedRequest.method === "bank" ? "Bank Transfer" : "UPI"}
                      </span>
                    </div>
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
                          <span className="text-sm font-medium text-slate-700">
                            {selectedRequest.accountNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-500">IFSC:</span>
                          <span className="text-sm font-medium text-slate-700">
                            {selectedRequest.ifscCode}
                          </span>
                        </div>
                        {selectedRequest.bankName && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-500">Bank:</span>
                            <span className="text-sm font-medium text-slate-700">
                              {selectedRequest.bankName}
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">UPI ID:</span>
                        <span className="text-sm font-medium text-slate-700">
                          {selectedRequest.upiId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Info */}
                {selectedRequest.status === "rejected" && selectedRequest.rejectionReason && (
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                    <h4 className="text-sm font-bold text-red-700 mb-2">Rejection Reason</h4>
                    <p className="text-sm text-red-600">{selectedRequest.rejectionReason}</p>
                  </div>
                )}

                {selectedRequest.status === "completed" && selectedRequest.transactionId && (
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                    <h4 className="text-sm font-bold text-emerald-700 mb-2">Transaction ID</h4>
                    <p className="text-sm text-emerald-600 font-mono">
                      {selectedRequest.transactionId}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Requested:</span>
                      <span className="text-sm text-slate-700">
                        {formatDate(selectedRequest.createdAt)}
                      </span>
                    </div>
                    {selectedRequest.approvedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Approved:</span>
                        <span className="text-sm text-slate-700">
                          {formatDate(selectedRequest.approvedAt)}
                        </span>
                      </div>
                    )}
                    {selectedRequest.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-500">Completed:</span>
                        <span className="text-sm text-slate-700">
                          {formatDate(selectedRequest.completedAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cancel Button for pending requests */}
                {selectedRequest.status === "requested" && (
                  <button
                    onClick={() => handleCancelRequest(selectedRequest._id)}
                    className="w-full py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Cancel Request
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestPayout;
