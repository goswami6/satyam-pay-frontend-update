import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Building2,
  IndianRupee,
  ShieldCheck,
  Calendar,
  CheckCircle,
  XCircle,
  Loader,
  ArrowLeft,
  AlertCircle,
  Ban,
  CreditCard,
  Landmark
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userAPI, getImageUrl } from "../../utils/api";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAuthHeader } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await userAPI.getUser(id);
      setUser(res.data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Status
  const toggleStatus = async () => {
    if (!user) return;
    try {
      setActionLoading(true);
      setError("");

      await userAPI.toggleUserStatus(user._id);

      setSuccessMessage("✓ User status updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      fetchUser();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={18} />
          Back to Users
        </button>
        <p className="text-red-600 font-semibold">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/users")}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
      >
        <ArrowLeft size={18} />
        Back to Users
      </button>

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

      <h1 className="text-3xl font-bold">User Details</h1>

      {/* Basic Info */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow border space-y-4">
          <h3 className="font-semibold text-lg">Personal Information</h3>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-start gap-3">
              <User size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Full Name</p>
                <p className="text-gray-900">{user.fullName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Email</p>
                <p className="text-gray-900 break-all">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Phone</p>
                <p className="text-gray-900">{user.phone || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Company Name</p>
                <p className="text-gray-900">{user.companyName || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Company Type</p>
                <p className="text-gray-900">{user.companyType || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t">
              <IndianRupee size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Balance</p>
                <p className="text-gray-900 font-bold">₹{(user.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Role</p>
                <p className="text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">
                    {user.role || "User"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={16} className="text-gray-400 mt-1 shrink-0" />
              <div>
                <p className="text-gray-600 text-xs font-semibold">Joined</p>
                <p className="text-gray-900">{new Date(user.createdAt).toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="bg-white p-6 rounded-xl shadow border space-y-4">
          <h3 className="font-semibold text-lg">Account Status</h3>

          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm font-semibold mb-2">Account Status</p>
              <span className={`px-3 py-1.5 text-sm rounded-full font-semibold inline-block ${user.status === "Active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
                }`}>
                {user.status || "Active"}
              </span>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-semibold mb-2">KYC Status</p>
              <span className={`px-3 py-1.5 text-sm rounded-full font-semibold inline-flex items-center gap-2 ${user.kyc?.status === "approved"
                ? "bg-emerald-100 text-emerald-800"
                : user.kyc?.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : user.kyc?.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                {user.kyc?.status === "approved" ? (
                  <>
                    <CheckCircle size={14} />
                    KYC Verified
                  </>
                ) : user.kyc?.status === "pending" ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Under Review
                  </>
                ) : user.kyc?.status === "rejected" ? (
                  <>
                    <XCircle size={14} />
                    Rejected
                  </>
                ) : (
                  <>
                    <XCircle size={14} />
                    Not Submitted
                  </>
                )}
              </span>
            </div>

            <div className="pt-4 border-t">
              <p className="text-gray-600 text-sm font-semibold mb-3">Actions</p>
              <button
                onClick={toggleStatus}
                disabled={actionLoading}
                className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${user.status === "Active"
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white"
                  : "bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white"
                  }`}
              >
                {actionLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Ban size={16} />
                    {user.status === "Active" ? "Suspend Account" : "Activate Account"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KYC Documents */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h3 className="font-semibold text-lg mb-6">KYC Documents</h3>

        {!user.kyc?.aadhar?.frontImage && !user.kyc?.pan?.image ? (
          <p className="text-gray-500 text-center py-8">No KYC documents uploaded yet</p>
        ) : (
          <div className="space-y-8">

            {/* Aadhar Section */}
            {user.kyc?.aadhar && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-indigo-600" size={20} />
                  <h4 className="font-semibold text-gray-800">Aadhar Card</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">Aadhar Number: <span className="font-semibold">{user.kyc.aadhar.number || "N/A"}</span></p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Aadhar Front */}
                  {user.kyc.aadhar.frontImage && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Front Side</p>
                      <div className="relative bg-gray-100 rounded-lg border h-48 overflow-hidden">
                        <img
                          src={getImageUrl(user.kyc.aadhar.frontImage)}
                          alt="Aadhar Front"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Aadhar Back */}
                  {user.kyc.aadhar.backImage && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Back Side</p>
                      <div className="relative bg-gray-100 rounded-lg border h-48 overflow-hidden">
                        <img
                          src={getImageUrl(user.kyc.aadhar.backImage)}
                          alt="Aadhar Back"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PAN Section */}
            {user.kyc?.pan && (
              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-indigo-600" size={20} />
                  <h4 className="font-semibold text-gray-800">PAN Card</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">PAN Number: <span className="font-semibold uppercase">{user.kyc.pan.number || "N/A"}</span></p>

                {user.kyc.pan.image && (
                  <div className="max-w-md">
                    <div className="relative bg-gray-100 rounded-lg border h-48 overflow-hidden">
                      <img
                        src={getImageUrl(user.kyc.pan.image)}
                        alt="PAN Card"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bank Details Section */}
            {user.kyc?.bank && (
              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <Landmark className="text-indigo-600" size={20} />
                  <h4 className="font-semibold text-gray-800">Bank Details</h4>
                </div>

                <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Account Holder Name</p>
                    <p className="text-gray-900 font-medium">{user.kyc.bank.accountHolderName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Account Number</p>
                    <p className="text-gray-900 font-medium">{user.kyc.bank.accountNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">IFSC Code</p>
                    <p className="text-gray-900 font-medium uppercase">{user.kyc.bank.ifscCode || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Bank Name</p>
                    <p className="text-gray-900 font-medium">{user.kyc.bank.bankName || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default UserDetail;
