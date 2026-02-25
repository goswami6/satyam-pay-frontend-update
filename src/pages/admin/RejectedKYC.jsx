import React, { useState, useEffect } from "react";
import {
  XCircle,
  Eye,
  User,
  CreditCard,
  Building2,
  Search,
  RefreshCw,
  X,
  ShieldX,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { kycAPI, getImageUrl } from "../../utils/api";

const RejectedKYC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  useEffect(() => {
    fetchRejectedKYC();
  }, []);

  const fetchRejectedKYC = async () => {
    try {
      setLoading(true);
      const response = await kycAPI.getRejectedKYC();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching rejected KYC:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReApprove = async (userId) => {
    if (!confirm("Are you sure you want to approve this KYC?")) return;
    try {
      await kycAPI.approve(userId);
      setUsers(users.filter((u) => u._id !== userId));
      setSelectedUser(null);
      alert("KYC Approved Successfully");
    } catch (error) {
      alert("Error approving KYC");
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.kyc?.rejectionReason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading rejected KYC applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">Rejected KYC</h1>
          </div>
          <p className="text-gray-500 ml-13">View all rejected KYC applications with rejection reasons</p>
        </div>
        <button
          onClick={fetchRejectedKYC}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Total Rejected</p>
              <p className="text-3xl font-black text-rose-700">{users.length}</p>
            </div>
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center">
              <XCircle className="w-7 h-7 text-rose-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Awaiting Resubmission</p>
              <p className="text-3xl font-black text-amber-700">{users.length}</p>
            </div>
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or rejection reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchTerm ? "No results found" : "No Rejected KYC"}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm
              ? "Try adjusting your search terms"
              : "There are no rejected KYC applications at this time."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Rejection Reason
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center shadow-md shadow-rose-100">
                          <span className="text-white font-bold text-sm">
                            {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-400">ID: {user._id?.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {user.email}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {user.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-rose-700 font-medium line-clamp-2">
                          {user.kyc?.rejectionReason || "No reason provided"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">
                        <XCircle className="w-3.5 h-3.5" />
                        Rejected
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2.5 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReApprove(user._id)}
                          className="p-2.5 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all"
                          title="Re-Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span>entries</span>
                  <span className="mx-3 text-gray-300">|</span>
                  <span>
                    Showing <strong className="text-gray-900">{startIndex + 1}</strong> to{" "}
                    <strong className="text-gray-900">{Math.min(endIndex, filteredUsers.length)}</strong> of{" "}
                    <strong className="text-gray-900">{filteredUsers.length}</strong>
                  </span>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg border transition-all ${currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                        }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[40px] px-3 py-2 text-sm font-semibold rounded-lg border transition-all ${currentPage === page
                              ? "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg border transition-all ${currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                        }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-500 to-red-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-black">
                      {selectedUser.fullName?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedUser.fullName}</h2>
                    <p className="text-white/70 text-sm">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rejection Reason Banner */}
            <div className="mx-6 mt-6 bg-rose-50 border border-rose-200 rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-rose-800 text-sm uppercase tracking-wider mb-1">
                    Rejection Reason
                  </h4>
                  <p className="text-rose-700 font-medium leading-relaxed">
                    {selectedUser.kyc?.rejectionReason || "No reason provided"}
                  </p>
                  {selectedUser.updatedAt && (
                    <p className="text-rose-400 text-xs mt-2 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Rejected on{" "}
                      {new Date(selectedUser.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[50vh] space-y-6">
              {/* Aadhar Card Section */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Aadhar Card</h3>
                    <p className="text-sm text-gray-500">Government Identity Proof</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Aadhar Number</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {selectedUser.kyc?.aadhar?.number || "N/A"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Front Side</p>
                    <img
                      src={getImageUrl(selectedUser.kyc?.aadhar?.frontImage)}
                      alt="Aadhar Front"
                      className="w-full h-44 object-cover rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer"
                      onClick={() =>
                        window.open(getImageUrl(selectedUser.kyc?.aadhar?.frontImage), "_blank")
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Back Side</p>
                    <img
                      src={getImageUrl(selectedUser.kyc?.aadhar?.backImage)}
                      alt="Aadhar Back"
                      className="w-full h-44 object-cover rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-colors cursor-pointer"
                      onClick={() =>
                        window.open(getImageUrl(selectedUser.kyc?.aadhar?.backImage), "_blank")
                      }
                    />
                  </div>
                </div>
              </div>

              {/* PAN Card Section */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">PAN Card</h3>
                    <p className="text-sm text-gray-500">Tax Identity Document</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 mb-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">PAN Number</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {selectedUser.kyc?.pan?.number || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">PAN Card Image</p>
                  <img
                    src={getImageUrl(selectedUser.kyc?.pan?.image)}
                    alt="PAN Card"
                    className="w-full h-44 object-cover rounded-xl border-2 border-gray-100 hover:border-amber-300 transition-colors cursor-pointer"
                    onClick={() => window.open(getImageUrl(selectedUser.kyc?.pan?.image), "_blank")}
                  />
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Bank Account Details</h3>
                    <p className="text-sm text-gray-500">For payout settlements</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Holder</p>
                    <p className="font-semibold text-gray-900">
                      {selectedUser.kyc?.bank?.accountHolderName || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Number</p>
                    <p className="font-mono font-semibold text-gray-900">
                      {selectedUser.kyc?.bank?.accountNumber || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">IFSC Code</p>
                    <p className="font-mono font-semibold text-gray-900">
                      {selectedUser.kyc?.bank?.ifscCode || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Bank Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedUser.kyc?.bank?.bankName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => handleReApprove(selectedUser._id)}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Re-Approve KYC
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RejectedKYC;
