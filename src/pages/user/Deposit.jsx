import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Wallet,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
  CreditCard,
  CheckCircle2,
  Zap
} from "lucide-react";
import { userAPI, paymentAPI } from "../../utils/api";

const Deposit = () => {
  const { user, getUserId, getUserBalance } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  const userId = getUserId() || sessionStorage.getItem("userId");

  const fetchBalance = async () => {
    try {
      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const { data } = await userAPI.getBalance(userId);
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      // Use balance from context as fallback
      setBalance(getUserBalance());
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBalance();
    } else {
      // Use balance from context if userId not available
      setBalance(getUserBalance());
    }
  }, [userId]);

  const handlePayment = async () => {
    if (!userId) {
      alert("User not authenticated. Please login again.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await paymentAPI.createOrder({ amount });

      if (data.gateway === "payu" && data.payuData) {
        // PayU redirect flow - create hidden form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.payuData.payuUrl;
        Object.entries(data.payuData).forEach(([key, value]) => {
          if (key === "payuUrl") return;
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value || "";
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }

      // Razorpay popup flow
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "SatyamPay",
        description: "Secure Wallet Deposit",
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await paymentAPI.verifyPayment({
              ...response,
              userId,
              amount: Number(amount),
            });
            alert("Payment Successful!");
            fetchBalance();
          } catch (error) {
            alert("Payment verification failed");
            console.error(error);
          }
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment Failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  const steps = [
    { id: 1, label: "Enter Amount", icon: IndianRupee },
    { id: 2, label: "Pay Securely", icon: CreditCard },
    { id: 3, label: "Instant Credit", icon: Zap },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 sm:px-0 pb-8">

      {/* Header Section */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Deposit Funds</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Add balance to your digital wallet instantly.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 w-fit">
          <ShieldCheck className="w-4 h-4" />
          Bank-grade Security
        </div>
      </div>

      {/* --- Steps Progress Bar --- */}
      <div className="mb-8 md:mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0 hidden md:block"></div>
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 relative z-10 overflow-x-auto pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center gap-2 md:gap-4 text-center min-w-[100px] md:min-w-0">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                ${amount > 0 ? 'bg-white border-indigo-600 text-indigo-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <step.icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] font-bold text-slate-400 mb-0.5">Step 0{step.id}</p>
                <p className="text-xs md:text-sm font-semibold text-slate-700 whitespace-nowrap">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6 order-2 lg:order-1">
          <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            {/* Subtle decorative background circle */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

            <label className="block text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 md:mb-6">
              Deposit Details
            </label>

            <div className="relative group mb-6 md:mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 md:pl-5 flex items-center pointer-events-none">
                <span className="text-xl md:text-2xl font-bold text-slate-300 group-focus-within:text-indigo-500 transition-colors">₹</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="block w-full pl-10 md:pl-12 pr-4 md:pr-6 py-4 md:py-6 bg-slate-50/50 border-2 border-slate-100 rounded-2xl md:rounded-3xl text-2xl md:text-3xl font-black text-slate-800 focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all outline-none placeholder:text-slate-200"
              />
            </div>

            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 md:mb-4">Quick Select</p>
            <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap md:gap-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`px-3 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${amount == amt
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 md:-translate-y-1"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm"
                    }`}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !amount || amount <= 0}
              className="w-full mt-8 md:mt-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white py-4 md:py-5 rounded-xl md:rounded-[1.5rem] font-black text-base md:text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 md:gap-3 group overflow-hidden relative"
            >
              <span className="relative z-10">{loading ? "Processing..." : "Complete Deposit"}</span>
              {!loading && <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 group-hover:translate-x-2 transition-transform" />}
            </button>

            <div className="mt-6 md:mt-8 flex items-center justify-center gap-4 md:gap-6 flex-wrap">
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-3 md:h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
              <div className="h-3 md:h-4 w-px bg-slate-200 hidden sm:block"></div>
              <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-500" />
                PCI-DSS Compliant
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Balance Summary Card */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6 order-1 lg:order-2">
          <div className="bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-indigo-500/20 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 md:mb-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">Wallet Status</p>
                  <p className="text-emerald-400 text-[10px] md:text-xs font-black uppercase">Verified</p>
                </div>
              </div>

              <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60">Current Balance</p>
              <h3 className="text-3xl md:text-4xl font-black text-white mt-1 md:mt-2 tracking-tighter">
                <span className="text-indigo-500 mr-1 text-xl md:text-2xl">₹</span>
                {balance.toLocaleString('en-IN')}
              </h3>

              <div className="mt-6 md:mt-10 p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                <p className="text-slate-400 text-[10px] md:text-[11px] leading-relaxed">
                  Your funds are held in a secure nodal account and are accessible 24/7.
                </p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="p-4 md:p-6 bg-indigo-50/50 border border-indigo-100 rounded-xl md:rounded-[2rem]">
            <h4 className="text-indigo-900 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3">Quick Tip</h4>
            <p className="text-indigo-700/70 text-[10px] md:text-xs leading-relaxed">
              Use UPI for the fastest experience. Most UPI transactions are processed within <span className="font-bold text-indigo-900">15 seconds</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;