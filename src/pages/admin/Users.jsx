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
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../utils/api";

const Users = () => {
  const { getAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // ✅ Fetch Users (Stable function)
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await userAPI.getAllUsers();

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.users || res.data?.data || [];

      setUsers(data);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ Toggle Status
  const toggleStatus = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await userAPI.toggleUserStatus(id);

      setSuccessMessage("✓ User status updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Safe Array Handling - Only show KYC approved users
  const usersArray = Array.isArray(users)
    ? users.filter(u => u?.kyc?.status === "approved")
    : [];

  const totalUsers = usersArray.length;
  const activeUsers = usersArray.filter(
    (u) => u?.status === "Active"
  ).length;
  const suspendedUsers = usersArray.filter(
    (u) => u?.status === "Suspended"
  ).length;
  const verifiedUsers = usersArray.filter(
    (u) => u?.kyc?.status === "approved"
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">User Management</h1>
        <p className="text-sm sm:text-base text-gray-500">
          Manage all KYC verified users and their access
        </p>
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
          <p className="text-xs sm:text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">

        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow border">
          <h3 className="text-xs sm:text-sm text-gray-600 font-semibold">Total Users</h3>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mt-1 sm:mt-2">{totalUsers}</p>
        </div>

        <div className="bg-green-50 p-3 sm:p-4 md:p-6 rounded-lg border border-green-200">
          <h3 className="text-xs sm:text-sm text-green-600 font-semibold">Active Users</h3>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700 mt-1 sm:mt-2">{activeUsers}</p>
        </div>

        <div className="bg-red-50 p-3 sm:p-4 md:p-6 rounded-lg border border-red-200">
          <h3 className="text-xs sm:text-sm text-red-600 font-semibold">Suspended</h3>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 mt-1 sm:mt-2">{suspendedUsers}</p>
        </div>

        <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-lg border border-blue-200">
          <h3 className="text-xs sm:text-sm text-blue-600 font-semibold">KYC Verified</h3>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700 mt-1 sm:mt-2">{verifiedUsers}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : usersArray.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No KYC verified users found</p>
        ) : (
          <table className="w-full text-xs sm:text-sm min-w-[800px]">
            <thead className="bg-gray-50 text-left border-b">
              <tr>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">User Info</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Company</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Role</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Status</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">KYC Status</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Joined</th>
                <th className="p-3 sm:p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {usersArray.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50 transition-colors">

                  <td className="p-3 sm:p-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{user.fullName || "N/A"}</p>
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
                      <Building2 size={14} className="text-gray-400 mt-1 shrink-0" />
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
                    <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-semibold">
                      {user.role || "User"}
                    </span>
                  </td>

                  <td className="p-3 sm:p-4">
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs rounded-full font-semibold ${user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.status || "Active"}
                    </span>
                  </td>

                  <td className="p-3 sm:p-4">
                    <span
                      className="px-2 sm:px-3 py-1 text-xs rounded-full font-semibold flex items-center gap-1 w-fit bg-emerald-100 text-emerald-800"
                    >
                      <ShieldCheck size={12} />
                      KYC Verified
                    </span>
                  </td>

                  <td className="p-3 sm:p-4 text-gray-600 text-xs">
                    {user.createdAt && (
                      <>
                        {new Date(user.createdAt).toLocaleDateString("en-IN")}
                        <br />
                        {new Date(user.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                  </td>

                  <td className="p-3 sm:p-4 flex gap-2 sm:gap-3">
                    {/* View Button */}
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Suspend Button */}
                    <button
                      onClick={() => toggleStatus(user._id)}
                      disabled={actionLoading === user._id}
                      className="text-red-600 hover:text-red-800 disabled:text-red-300"
                      title="Suspend / Activate"
                    >
                      {actionLoading === user._id ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Ban size={16} />
                      )}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default Users;
