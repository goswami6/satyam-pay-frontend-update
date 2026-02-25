import { useState, useEffect } from "react";
import {
  Key,
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
  Calendar,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { payoutApiTokenAPI } from "../../utils/api";

const APITokenRequests = () => {
  const { getUserId } = useAuth();
  const adminId = getUserId();

  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await payoutApiTokenAPI.getAllRequests(filter === "all" ? "" : filter);
      setRequests(response.data.requests || []);
      setStats(response.data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (requestId) => {
    if (!confirm(`Are you sure you want to approve this API token request? User will be able to make payout requests via API.`)) return;

    try {
      setProcessing(true);
      await payoutApiTokenAPI.approveRequest(requestId, { adminId });
      alert("Request approved successfully! API Keys generated. Payout requests via these keys will need your approval.");
      setShowModal(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve request");
    } finally {
      setProcessing(false);
    }
  };

  const rejectRequest = async (requestId) => {
    if (!rejectReason.trim()) {
      return alert("Please enter a rejection reason");
    }

    try {
      setProcessing(true);
      await payoutApiTokenAPI.rejectRequest(requestId, { reason: rejectReason });
      alert("Request rejected successfully!");
      setShowModal(false);
      setSelectedRequest(null);
      setRejectReason("");
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessing(false);
    }
  };

  const openRequestModal = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
    setRejectReason("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredRequests = requests.filter((req) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      req.name?.toLowerCase().includes(searchLower) ||
      req.userId?.fullName?.toLowerCase().includes(searchLower) ||
      req.userId?.email?.toLowerCase().includes(searchLower) ||
      req.userId?.phone?.includes(search)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset page on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Key className="w-8 h-8 text-indigo-600" />
          Payout API Token Requests
        </h1>
        <p className="text-slate-500 mt-1">
          Manage user requests for payout API tokens
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-400 font-bold uppercase">Total Requests</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
          <p className="text-xs text-amber-600 font-bold uppercase">Pending</p>
          <p className="text-2xl font-black text-amber-700 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p className="text-xs text-emerald-600 font-bold uppercase">Approved</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.approved}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
          <p className="text-xs text-red-600 font-bold uppercase">Rejected</p>
          <p className="text-2xl font-black text-red-700 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <button
            onClick={fetchRequests}
            className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <Key className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700">No Requests Found</h3>
            <p className="text-sm text-slate-400 mt-1">
              {filter === "all" ? "No API token requests yet" : `No ${filter} requests`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">User</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Token Name</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Mode</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{request.userId?.fullName || "N/A"}</p>
                        <p className="text-xs text-slate-400">{request.userId?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{request.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${request.mode === "live"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                        }`}>
                        {request.mode?.toUpperCase() || "LIVE"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500">{formatDate(request.createdAt)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openRequestModal(request)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-200 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredRequests.length > 0 && (
          <div className="px-6 py-4 border-t bg-slate-50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border rounded-lg bg-white"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
                <span className="mx-2 text-gray-300">|</span>
                <span>Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredRequests.length)}</strong> of <strong>{filteredRequests.length}</strong></span>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[36px] px-3 py-1.5 text-sm rounded-lg border ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-xl w-full animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Key className="w-6 h-6 text-indigo-600" />
              Request Details
            </h2>

            {/* User Info */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">User Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedRequest.userId?.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedRequest.userId?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedRequest.userId?.phone}</span>
                </div>
                {selectedRequest.userId?.companyName && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{selectedRequest.userId?.companyName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Request Info */}
            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">Request Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Token Name:</span>
                  <span className="text-sm font-bold text-slate-700">{selectedRequest.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Mode:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedRequest.mode === "live"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                    }`}>
                    {selectedRequest.mode?.toUpperCase() || "LIVE"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Status:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Requested:</span>
                  <span className="text-sm text-slate-700">{formatDate(selectedRequest.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Actions for Pending */}
            {selectedRequest.status === "pending" && (
              <>
                {/* Reject Reason */}
                <div className="mb-6">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:border-indigo-500 outline-none resize-none"
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
                    disabled={processing}
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2"
                  >
                    {processing ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve
                  </button>
                </div>
              </>
            )}

            {/* View-only for processed requests */}
            {selectedRequest.status === "approved" && (
              <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
                <h3 className="text-sm font-bold text-emerald-800 mb-2">Approved Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-emerald-600">Key ID:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded">{selectedRequest.keyId}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-emerald-600">Approved At:</span>
                    <span className="text-sm">{formatDate(selectedRequest.approvedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedRequest.status === "rejected" && (
              <div className="bg-red-50 rounded-2xl p-4 mb-6">
                <h3 className="text-sm font-bold text-red-800 mb-2">Rejection Details</h3>
                <p className="text-sm text-red-600">{selectedRequest.rejectionReason}</p>
                <p className="text-xs text-slate-500 mt-2">
                  Rejected at: {formatDate(selectedRequest.rejectedAt)}
                </p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedRequest(null);
              }}
              className="w-full py-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default APITokenRequests;
