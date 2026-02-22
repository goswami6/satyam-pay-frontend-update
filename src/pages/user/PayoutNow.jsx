import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Building2,
  User,
  Hash,
  ArrowRight,
  Info,
  IndianRupee,
  ShieldCheck,
  Banknote,
  SendHorizontal,
  CreditCard,
  Zap,
  AlertCircle
} from "lucide-react";
import { userAPI, paymentAPI } from "../../utils/api";

const PayoutNow = () => {
  const { getUserId, getUserBalance } = useAuth();
  const userId = getUserId() || sessionStorage.getItem("userId");

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const withdrawalFee = 0.02; // Flat Commission fee

  const fetchBalance = async () => {
    try {
      if (!userId) {
        console.error("User ID not found");
        setBalance(getUserBalance());
        return;
      }

      const { data } = await userAPI.getBalance(userId);
      setBalance(data.balance || 0);
    } catch (error) {
      console.error("Balance fetch error:", error);
      // Fallback to context balance
      setBalance(getUserBalance());
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalance();
    } else {
      setBalance(getUserBalance());
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const numAmount = Number(amount);

    if (!amount || numAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (numAmount < 50) {
      setError("Minimum withdrawal amount is ₹50");
      return;
    }

    if (numAmount + withdrawalFee > balance) {
      setError(`Insufficient balance. You have ₹${balance.toFixed(2)}, need ₹${(numAmount + withdrawalFee).toFixed(2)}`);
      return;
    }

    if (!accountName.trim() || !accountNumber.trim() || !ifsc.trim()) {
      setError("All bank details are required");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())) {
      setError("Invalid IFSC code format");
      return;
    }

    try {
      setLoading(true);
      const response = await paymentAPI.withdraw({
        userId,
        amount: numAmount,
        accountName,
        accountNumber,
        ifsc: ifsc.toUpperCase(),
      });

      setSuccessMessage("✓ Payout request submitted successfully! Awaiting admin approval.");

      // Reset form
      setAmount("");
      setAccountName("");
      setAccountNumber("");
      setIfsc("");

      setTimeout(() => {
        fetchBalance();
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Withdrawal failed. Please try again.";
      setError(errorMsg);
      console.error("Payout Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Safe calculation for UI - REAL-TIME UPDATES
  const numAmount = amount ? Number(amount) : 0;
  const withdrawable = Math.max(0, balance - withdrawalFee);
  const totalDeduction = numAmount + withdrawalFee;
  const remainingAfter = balance - totalDeduction;

  const steps = [
    { id: 1, label: "Amount", icon: Banknote, active: numAmount >= 50 },
    { id: 2, label: "Beneficiary", icon: CreditCard, active: accountNumber.length > 5 },
    { id: 3, label: "Settle", icon: SendHorizontal, active: false },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4">

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="text-left">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Payout Now</h1>
          <p className="text-slate-500 mt-2 font-medium">Transfer funds to your bank account with zero latency.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-3 rounded-2xl text-xs font-black border border-emerald-100 shadow-sm shadow-emerald-100">
          <ShieldCheck className="w-5 h-5" />
          SECURED BY RAZORPAYX
        </div>
      </div>

      {/* --- Progress Steps --- */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:text-center group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                ${step.active
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'bg-white border-slate-200 text-slate-400'}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <div className="text-left md:text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Step 0{step.id}</p>
                <p className="text-sm font-bold text-slate-700">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Main Form Area */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-emerald-700">{successMessage}</p>
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Payout Amount</label>
                {balance > 50 && (
                  <button
                    type="button"
                    onClick={() => setAmount(withdrawable.toFixed(2))}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                  >
                    Withdraw Max
                  </button>
                )}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <IndianRupee className="h-8 w-8 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-16 pr-6 py-8 bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] text-4xl font-black text-slate-800 focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Zap className="w-3 h-3 fill-slate-400" />
                <p className="text-[10px] font-bold uppercase tracking-tighter">Min Settlement: ₹50.00</p>
              </div>
            </div>

            {/* Account Details Grid */}
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Destination Account</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="relative group">
                  <Hash className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
                    required
                  />
                </div>
                <div className="relative group md:col-span-2">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Bank IFSC Code"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-black text-slate-700 tracking-widest placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-100 disabled:text-slate-400 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Process Payout <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </form>
        </div>

        {/* Sidebar: Balance & Logic Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden text-white group border border-slate-800">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Wallet Balance</p>
              </div>

              <h2 className="text-5xl font-black tracking-tighter italic mb-2">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Max Payout</span>
                  <span className="text-xl font-black text-emerald-400">₹{withdrawable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Breakdown */}
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 space-y-3 backdrop-blur-sm">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                    <span>Requested</span>
                    <span className="text-white">₹{Number(amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-rose-400 uppercase">
                    <span>Admin Fee</span>
                    <span>+ ₹{withdrawalFee.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2"></div>
                  <div className="flex justify-between items-center text-sm font-black">
                    <span className="text-indigo-400">Total Deduction</span>
                    <span className="text-xl">₹{totalDeduction.toFixed(2)}</span>
                  </div>
                  {numAmount > 0 && (
                    <div className="flex justify-between items-center text-[11px] font-bold text-emerald-300 uppercase pt-2 border-t border-white/5">
                      <span>Remaining Balance</span>
                      <span className="text-lg font-black">₹{remainingAfter.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Policy Card */}
          <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest">
              <Info className="w-4 h-4 text-indigo-500" />
              Settlement Policy
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Standard processing time is <span className="font-bold text-slate-900">2-24 business hours</span> depending on bank cycles.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Payouts are final. Please verify the <span className="font-bold text-indigo-600 italic">Account Number</span> carefully before proceeding.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutNow;