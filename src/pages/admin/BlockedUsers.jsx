import { useEffect, useState, useCallback } from "react";
import {
  Ban,
  Eye,
  Loader,
  AlertCircle,
  CheckCircle,
  Mail,
  Phone,
  Building2,
  UserX,
  Unlock,
  RefreshCw,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../utils/api";

const BlockedUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await userAPI.getAllUsers();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.users || res.data?.data || [];

      // Filter only blocked/suspended users
      const blockedUsers = data.filter((u) => u?.status === "Suspended");
      setUsers(blockedUsers);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load blocked users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Unblock User (Toggle Status back to Active)
  const unblockUser = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await userAPI.toggleUserStatus(id);

      setSuccessMessage("✓ User unblocked successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to unblock user");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter users by search term
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user?.fullName?.toLowerCase().includes(search) ||
      user?.email?.toLowerCase().includes(search) ||
      user?.phone?.includes(search) ||
      user?.companyName?.toLowerCase().includes(search)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserX className="w-8 h-8 text-red-600" />
            Blocked Users
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            View and manage all suspended/blocked users
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 sm:gap-3 bg-red-50 border border-red-200 p-3 sm:p-4 rounded-lg">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="flex items-start gap-2 sm:gap-3 bg-emerald-50 border border-emerald-200 p-3 sm:p-4 rounded-lg">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-red-50 p-4 sm:p-6 rounded-lg border border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm text-red-600 font-semibold">
                Total Blocked
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-red-700">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 sm:p-6 rounded-lg border border-orange-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <UserX className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm text-orange-600 font-semibold">
                KYC Verified Blocked
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-orange-700">
                {users.filter((u) => u?.kyc?.status === "approved").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Unlock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm text-gray-600 font-semibold">
                Pending Unblock
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-700">
                {users.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-red-600 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <UserX className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No blocked users found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm
                ? "Try a different search term"
                : "All users are currently active"}
            </p>
          </div>
        ) : (
          <table className="w-full text-xs sm:text-sm min-w-[800px]">
            <thead className="bg-red-50 text-left border-b border-red-100">
              <tr>
                <th className="p-3 sm:p-4 font-semibold text-red-700">
                  User Info
                </th>
                <th className="p-3 sm:p-4 font-semibold text-red-700">
                  Company
                </th>
                <th className="p-3 sm:p-4 font-semibold text-red-700">
                  KYC Status
                </th>
                <th className="p-3 sm:p-4 font-semibold text-red-700">
                  Blocked Since
                </th>
                <th className="p-3 sm:p-4 font-semibold text-red-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-gray-100 hover:bg-red-50/30 transition-colors"
                >
                  <td className="p-3 sm:p-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">
                        {user.fullName || "N/A"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Mail size={12} className="text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone size={12} className="text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-3 sm:p-4">
                    <div className="flex items-start gap-2">
                      <Building2
                        size={14}
                        className="text-gray-400 mt-1 shrink-0"
                      />
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">
                          {user.companyName || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.companyType || ""}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3 sm:p-4">
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs rounded-full font-semibold ${user?.kyc?.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : user?.kyc?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {user?.kyc?.status || "Not Submitted"}
                    </span>
                  </td>

                  <td className="p-3 sm:p-4 text-gray-600 text-xs">
                    {user.updatedAt ? formatDate(user.updatedAt) : "N/A"}
                  </td>

                  <td className="p-3 sm:p-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* View Button */}
                      <button
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Unblock Button */}
                      <button
                        onClick={() => unblockUser(user._id)}
                        disabled={actionLoading === user._id}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        title="Unblock User"
                      >
                        {actionLoading === user._id ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <Unlock size={14} />
                        )}
                        Unblock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-4 py-3 border-t bg-gray-50">
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
                <span>Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, filteredUsers.length)}</strong> of <strong>{filteredUsers.length}</strong></span>
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
    </div>
  );
};

export default BlockedUsers;
