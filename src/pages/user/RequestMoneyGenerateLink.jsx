import { useState } from "react";
import {
  Link2,
  User,
  Mail,
  IndianRupee,
  FileText,
  Calendar,
  ArrowRight,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Share2,
  ExternalLink
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { paymentAPI } from "../../utils/api";

const RequestMoneyGenerateLink = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    description: "",
    date: "",
  });

  const [paymentLink, setPaymentLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Please login again");
    if (Number(formData.amount) <= 0) return alert("Enter valid amount");

    try {
      setLoading(true);
      setPaymentLink("");

      const response = await paymentAPI.generateLink({
        ...formData,
        amount: Number(formData.amount),
        userId,
      });

      setPaymentLink(response.data.paymentLink);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, label: "Customer Info", icon: User },
    { id: 2, label: "Link Details", icon: Link2 },
    { id: 3, label: "Share Link", icon: Share2 },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Request Money</h1>
          <p className="text-slate-500 mt-1">Create a professional payment link for your clients.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-xs font-bold border border-blue-100">
          <ShieldCheck className="w-4 h-4" />
          Secure Payment Gateway
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:text-center group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                ${(step.id === 1 && formData.name) || (step.id === 2 && paymentLink) || (step.id === 3 && paymentLink)
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-400'}`}>
                <step.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Step 0{step.id}</p>
                <p className="text-sm font-bold text-slate-700">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Form Column */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Customer Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Request Amount</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <IndianRupee className="h-6 w-6 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="block w-full pl-16 pr-4 py-6 bg-slate-50/50 border-2 border-slate-100 rounded-3xl text-3xl font-black text-slate-800 focus:ring-0 focus:border-blue-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Service Payment"
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Due Date (Optional)</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? "Creating Link..." : "Generate Payment Link"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Sidebar / Result Column */}
        <div className="lg:col-span-2 space-y-6">
          {paymentLink ? (
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white animate-in zoom-in-95 duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic tracking-tight">Link Ready to Share</h3>
                  <p className="text-slate-400 text-xs mt-1">Copy the link below and send it to your client.</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Unique Payment URL</p>
                  <div className="flex items-center gap-3">
                    <input
                      readOnly
                      value={paymentLink}
                      className="bg-transparent border-none text-xs text-slate-200 w-full outline-none truncate font-medium"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-white/10 rounded-xl transition-colors shrink-0"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={paymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-white text-slate-900 py-3 rounded-xl text-xs font-black transition-transform active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Preview
                  </a>
                  <button
                    onClick={() => setPaymentLink("")}
                    className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white py-3 rounded-xl text-xs font-black hover:bg-white/10 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
                <Share2 className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h4 className="font-black text-slate-900">No Link Generated</h4>
                <p className="text-xs text-slate-400 px-4 mt-2 leading-relaxed">Fill in the details on the left to create a secure checkout link for your customer.</p>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Helpful Information</h4>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Links are valid for <span className="text-slate-900 font-bold">30 days</span> unless a specific due date is set.</p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Customers can pay via <span className="text-slate-900 font-bold">UPI, Cards, and Net Banking</span>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMoneyGenerateLink;