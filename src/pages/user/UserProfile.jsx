import { useEffect, useState, useCallback, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Wallet,
  Save,
  ShieldCheck,
  Camera,
  Globe,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  KeyRound
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../utils/api";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserProfile = () => {
  const { getUserId } = useAuth();
  const userId = getUserId() || sessionStorage.getItem("userId");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "",
    balance: 0,
    role: "user",
    profileImage: "",
    kyc: { status: "not_submitted" }
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: ''
  });
  const [emailLoading, setEmailLoading] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setFetchLoading(true);
      setError("");

      // Validate userId
      if (!userId || userId === "null" || userId === "undefined") {
        setError("User ID not found. Please log in again.");
        setFetchLoading(false);
        return;
      }

      const res = await userAPI.getProfile(userId);
      if (res.data) {
        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          companyName: res.data.companyName || "",
          companyType: res.data.companyType || "",
          balance: res.data.balance || 0,
          role: res.data.role || "user",
          profileImage: res.data.profileImage || "",
          kyc: res.data.kyc || { status: "not_submitted" }
        });
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setFetchLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, fetchProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    try {
      setImageUploading(true);
      setError("");

      const formDataUpload = new FormData();
      formDataUpload.append("profileImage", file);

      const res = await userAPI.uploadProfileImage(userId, formDataUpload);

      if (res.data?.profileImage) {
        setFormData(prev => ({
          ...prev,
          profileImage: res.data.profileImage
        }));
        setSuccessMessage("✓ Profile image updated!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setError(error.response?.data?.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  // Trigger file input click
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      if (!userId || userId === "null" || userId === "undefined") {
        setError("User ID not found. Please log in again.");
        return;
      }

      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        companyName: formData.companyName,
        companyType: formData.companyType
      };

      const res = await userAPI.updateProfile(userId, updateData);
      if (res.data) {
        setFormData(prev => ({
          ...prev,
          fullName: res.data.fullName || prev.fullName,
          phone: res.data.phone || prev.phone,
          companyName: res.data.companyName || prev.companyName,
          companyType: res.data.companyType || prev.companyType
        }));
      }
      setSuccessMessage("✓ Profile Updated Successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  // Format balance display
  const formatBalance = (balance) => {
    const num = Number(balance) || 0;
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Handle email change
  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (!emailData.newEmail || !emailData.password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setEmailLoading(true);
      const res = await userAPI.changeEmail(userId, emailData);
      toast.success(res.data.message || 'Email updated successfully');
      setFormData(prev => ({ ...prev, email: res.data.email }));
      setEmailData({ newEmail: '', password: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      const res = await userAPI.changePassword(userId, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success(res.data.message || 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your professional identity and security preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProfile}
            disabled={fetchLoading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${fetchLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border ${formData.kyc?.status === 'approved'
            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
            : formData.kyc?.status === 'pending'
              ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
              : formData.kyc?.status === 'rejected'
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
            <ShieldCheck className="w-4 h-4" />
            {formData.kyc?.status === 'approved' ? 'KYC Verified' :
              formData.kyc?.status === 'pending' ? 'KYC Pending' :
                formData.kyc?.status === 'rejected' ? 'KYC Rejected' : 'KYC Not Submitted'}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-lg my-6">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-lg my-6">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Loading State */}
      {fetchLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Profile Card & Balance */}
          <div className="space-y-6">
            {/* Identity Card */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-violet-600"></div>

              <div className="relative pt-8">
                <div className="relative inline-block">
                  <div className="w-28 h-28 bg-white rounded-3xl p-1 shadow-xl mx-auto relative z-10 overflow-hidden">
                    {formData.profileImage ? (
                      <img
                        src={`${API_BASE_URL}${formData.profileImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-[1.2rem]"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full bg-slate-100 rounded-[1.2rem] items-center justify-center ${formData.profileImage ? 'hidden' : 'flex'}`}
                    >
                      <User className="w-12 h-12 text-slate-300" />
                    </div>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                  />

                  {/* Camera Button */}
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    disabled={imageUploading}
                    className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform z-20 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {imageUploading ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {formData.fullName || "Update Name"}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">{formData.email}</p>
                </div>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg tracking-wider ${formData.kyc?.status === 'approved'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-50 text-slate-500'
                    }`}>
                    {formData.kyc?.status === 'approved' ? 'KYC Verified' :
                      formData.kyc?.status === 'pending' ? 'KYC Pending' :
                        formData.kyc?.status === 'rejected' ? 'KYC Rejected' : 'KYC Required'}
                  </span>
                  <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase rounded-lg tracking-wider">{formData.role || 'User'}</span>
                </div>
              </div>
            </div>

            {/* Balance Card */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div className="flex items-center justify-between mb-6">
                <Wallet className="w-8 h-8 text-indigo-500" />
                <button
                  onClick={fetchProfile}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  title="Refresh Balance"
                >
                  <RefreshCw className={`w-4 h-4 text-slate-400 ${fetchLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Wallet Balance</p>
              <h2 className={`text-4xl font-black mt-2 tracking-tighter italic ${Number(formData.balance) < 0 ? 'text-red-400' : 'text-white'}`}>
                ₹{formatBalance(formData.balance)}
              </h2>
              {Number(formData.balance) < 0 && (
                <p className="text-red-400 text-xs mt-2">⚠️ Negative balance detected</p>
              )}
              <button className="mt-6 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2">
                View Ledger <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Column: Update Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Personal Information</h4>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName || ""}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Email (Disabled) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Company Type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Business Type</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        name="companyType"
                        value={formData.companyType || ""}
                        onChange={handleChange}
                        placeholder="e.g. Private Limited"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-700 ml-1">Registered Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName || ""}
                        onChange={handleChange}
                        placeholder="Legal Entity Name"
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-400 font-medium flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" />
                    Last updated from IP: 192.168.1.1
                  </p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving Changes..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Security Section */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mt-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Account Security</h2>
                  <p className="text-xs text-slate-500">Manage your email and password</p>
                </div>
              </div>

              {/* Change Email Section */}
              <div className="mb-8 p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Change Email</h3>
                    <p className="text-xs text-slate-500">Update your email address</p>
                  </div>
                </div>

                <form onSubmit={handleEmailChange} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Current Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">New Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={emailData.newEmail}
                        onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                        placeholder="Enter new email"
                        className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Confirm with Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showEmailPassword ? 'text' : 'password'}
                        value={emailData.password}
                        onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showEmailPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={emailLoading}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
                  >
                    {emailLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Email
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Change Password Section */}
              <div className="p-6 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
                    <p className="text-xs text-slate-500">Update your password for better security</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1 block">Current Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-500 outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="New password"
                          className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-500 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 mb-1 block">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm password"
                          className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl focus:border-purple-500 outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {passwordData.newPassword && passwordData.confirmPassword && (
                    <div className={`flex items-center gap-2 text-xs font-medium ${passwordData.newPassword === passwordData.confirmPassword
                        ? 'text-emerald-600'
                        : 'text-red-600'
                      }`}>
                      {passwordData.newPassword === passwordData.confirmPassword ? (
                        <>
                          <CheckCircle size={14} />
                          Passwords match
                        </>
                      ) : (
                        <>
                          <AlertCircle size={14} />
                          Passwords do not match
                        </>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
                  >
                    {passwordLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Security Tips */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Security Tips
                </h4>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    Use a strong password with at least 8 characters
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    Never share your password with anyone
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    Change your password regularly
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;