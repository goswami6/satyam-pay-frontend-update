import { useEffect, useState } from "react";
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
  Loader
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userAPI } from "../../utils/api";

const UserProfile = () => {
  const { user, getUserId, getAuthHeader } = useAuth();
  const userId = getUserId();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    companyType: "",
    balance: 0,
    kyc: { status: "not_submitted" }
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProfile = async () => {
    try {
      setFetchLoading(true);
      setError("");

      // Validate userId
      if (!userId || userId === "null") {
        setError("User ID not found. Please log in again.");
        setFetchLoading(false);
        return;
      }

      const res = await userAPI.getProfile(userId);
      setFormData(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      if (!userId || userId === "null") {
        setError("User ID not found. Please log in again.");
        return;
      }

      const res = await userAPI.updateProfile(userId, formData);
      setSuccessMessage("✓ Profile Updated Successfully!");
      setFormData(res.data);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-1">Manage your professional identity and security preferences.</p>
        </div>
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
                    <div className="w-full h-full bg-slate-100 rounded-[1.2rem] flex items-center justify-center">
                      <User className="w-12 h-12 text-slate-300" />
                    </div>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform z-20">
                    <Camera className="w-4 h-4" />
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
              <Wallet className="w-8 h-8 text-indigo-500 mb-6" />
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Wallet Balance</p>
              <h2 className="text-4xl font-black mt-2 tracking-tighter italic">
                ₹{formData.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </h2>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;