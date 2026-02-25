import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  IndianRupee,
  FileText,
  Calendar,
  Send,
  ShieldCheck,
  Info,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { paymentAPI } from "../../utils/api";

const RequestMoney = () => {
  const { getUserId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    description: "",
    date: "",
  });

  const userId = getUserId() || sessionStorage.getItem("userId");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Recipient name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = "Enter a valid amount";
    }
    if (Number(formData.amount) < 10) {
      newErrors.amount = "Minimum amount is ₹10";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!userId) {
      setErrors({ submit: "Please login again" });
      return;
    }

    try {
      setLoading(true);
      const response = await paymentAPI.generateLink({
        name: formData.name,
        email: formData.email,
        amount: Number(formData.amount),
        description: formData.description,
        dueDate: formData.date || null,
        userId,
      });

      const data = response.data;
      if (data.emailSent) {
        setSuccessMessage("Payment request sent successfully! The recipient will receive an email with the payment link.");
      } else {
        setSuccessMessage("Payment link generated but email could not be sent. Please share the link manually.");
      }

      // Reset form
      setFormData({ name: "", email: "", amount: "", description: "", date: "" });
      setErrors({});

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to generate payment link";
      setErrors({ submit: errorMsg });
      console.error("Request Money Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Recipient", desc: "Contact details", icon: User },
    { id: 2, title: "Details", desc: "Amount & Purpose", icon: FileText },
    { id: 3, title: "Review", desc: "Send Request", icon: Send },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">

      {/* Header & Stepper */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Request Money</h1>
        <p className="text-slate-500 mt-1">Send a professional payment request to anyone via email.</p>

        <div className="mt-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="bg-white md:bg-transparent p-4 md:p-0 rounded-2xl border border-slate-100 md:border-none flex items-center gap-4 md:flex-col md:text-center group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                  ${formData.name && step.id === 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-indigo-600 text-indigo-600'}`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{step.title}</h3>
                  <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">

            {/* Success Message */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle2 size={18} />
                {successMessage}
              </div>
            )}

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.submit}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Recipient Name*</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-700 ${errors.name ? "border-red-500" : "border-slate-100 focus:border-indigo-500"
                      }`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address*</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-700 ${errors.email ? "border-red-500" : "border-slate-100 focus:border-indigo-500"
                      }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Request Amount*</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="10"
                  className={`w-full pl-11 pr-4 py-5 bg-slate-50 border-2 rounded-2xl focus:bg-white focus:ring-0 outline-none transition-all text-2xl font-black text-slate-800 ${errors.amount ? "border-red-500" : "border-slate-100 focus:border-indigo-500"
                    }`}
                />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this request for?"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-700 resize-none"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Due Date (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Create Payment Request
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-400 mb-6">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase">Requested from</p>
                    <h4 className="text-white text-lg font-bold mt-1">{formData.name || "Recipient Name"}</h4>
                    <p className="text-slate-500 text-sm">{formData.email || "email@example.com"}</p>
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <User className="w-6 h-6 text-slate-400" />
                  </div>
                </div>

                <div className="py-6 border-y border-white/5">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-2">Amount to pay</p>
                  <div className="text-3xl font-black text-white">
                    <span className="text-indigo-500 mr-2">₹</span>
                    {Number(formData.amount || 0).toLocaleString('en-IN')}
                  </div>
                </div>

                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase">Note</p>
                  <p className="text-slate-300 text-sm mt-2 italic leading-relaxed">
                    "{formData.description || "No description provided."}"
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">SatyamPay Secure Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-900">Secure Payment Links</h4>
              <p className="text-xs text-indigo-700/70 leading-relaxed mt-1">
                Your recipient will receive a secure link to pay via UPI, Card, or Netbanking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMoney;

