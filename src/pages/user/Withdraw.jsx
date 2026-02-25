import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Wallet,
  Building2,
  User,
  Hash,
  ArrowRight,
  AlertCircle,
  Clock,
  Info,
  IndianRupee,
  CheckCircle2,
  Banknote,
  ShieldCheck,
  Zap,
  Plus
} from "lucide-react";
import { userAPI, kycAPI, bankAPI, withdrawAPI, settingsAPI } from "../../utils/api";

const Withdraw = () => {
  const { getUserId, getUserBalance } = useAuth();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasBankAccount, setHasBankAccount] = useState(null);
  const [bankLoading, setBankLoading] = useState(true);

  // Payment settings from admin
  const [paymentSettings, setPaymentSettings] = useState({
    commissionRate: 2,
    minWithdrawal: 50,
    maxWithdrawal: 500000
  });

  const userId = getUserId() || sessionStorage.getItem("userId");

  // Calculate fees dynamically
  const amountNum = Number(amount) || 0;
  const platformFee = (amountNum * paymentSettings.commissionRate) / 100;
  const totalDeduction = amountNum + platformFee;

  const fetchBalance = async () => {
    try {
      if (!userId) {
        setBalance(getUserBalance());
        return;
      }
      const { data } = await userAPI.getBalance(userId);
      setBalance(data.balance);
    } catch (err) {
      setBalance(getUserBalance());
    }
  };

  // ✅ Fetch Bank Details (from KYC)
  const fetchBankDetails = async () => {
    try {
      setBankLoading(true);
      if (!userId) {
        setHasBankAccount(false);
        return;
      }

      // First try to get KYC bank details
      const kycResponse = await kycAPI.getStatus(userId);

      if (kycResponse.data?.kyc?.bank?.accountNumber) {
        const kycBank = kycResponse.data.kyc.bank;
        setAccountName(kycBank.accountHolderName || "");
        setAccountNumber(kycBank.accountNumber || "");
        setIfsc(kycBank.ifscCode || "");
        setBankName(kycBank.bankName || "");
        setHasBankAccount(true);
        return;
      }

      // Fallback to separate bank endpoint
      const { data } = await bankAPI.getBanks(userId);

      if (data && data.accountNumber) {
        setAccountName(data.accountHolderName || "");
        setAccountNumber(data.accountNumber || "");
        setIfsc(data.ifsc || "");
        setBankName(data.bankName || "");
        setHasBankAccount(true);
      } else {
        setHasBankAccount(false);
      }
    } catch (err) {
      console.log("No bank account found");
      setHasBankAccount(false);
    } finally {
      setBankLoading(false);
    }
  };

  // ✅ Fetch Payment Settings from Admin
  const fetchPaymentSettings = async () => {
    try {
      const { data } = await settingsAPI.getPayment();
      if (data) {
        setPaymentSettings({
          commissionRate: data.commissionRate || 2,
          minWithdrawal: data.minWithdrawal || 50,
          maxWithdrawal: data.maxWithdrawal || 500000
        });
      }
    } catch (err) {
      console.log("Using default payment settings");
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchBankDetails();
    fetchPaymentSettings();
  }, [userId]);

  const validateForm = () => {
    if (!hasBankAccount) return "Please add bank account first";
    if (!accountName.trim()) return "Account holder name is required";
    if (!accountNumber.trim()) return "Account number is required";
    if (!ifsc.trim()) return "IFSC code is required";
    return "";
  };

  const handleWithdraw = async () => {
    setError("");
    setSuccessMessage("");

    if (!amountNum || amountNum < paymentSettings.minWithdrawal) {
      setError(`Minimum withdrawal amount is ₹${paymentSettings.minWithdrawal}`);
      return;
    }

    if (amountNum > paymentSettings.maxWithdrawal) {
      setError(`Maximum withdrawal amount is ₹${paymentSettings.maxWithdrawal.toLocaleString()}`);
      return;
    }

    if (totalDeduction > balance) {
      setError(`Insufficient balance. Available: ₹${balance.toFixed(2)}, Required: ₹${totalDeduction.toFixed(2)}`);
      return;
    }

    const formError = validateForm();
    if (formError) {
      setError(formError);
      return;
    }

    try {
      setLoading(true);
      await withdrawAPI.request({
        userId,
        amount: amountNum,
        platformFee: platformFee,
        totalDeduction: totalDeduction,
        accountName,
        accountNumber,
        ifsc,
        bankName,
      });

      setSuccessMessage("✓ Request submitted! Awaiting admin approval.");
      setAmount("");

      setTimeout(() => {
        fetchBalance();
        setSuccessMessage("");
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Withdrawal failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const withdrawFull = () => {
    // Calculate max amount user can withdraw considering fees
    // amount + (amount * commissionRate/100) <= balance
    // amount * (1 + commissionRate/100) <= balance
    // amount <= balance / (1 + commissionRate/100)
    const maxAmount = Math.floor(balance / (1 + paymentSettings.commissionRate / 100));
    if (maxAmount >= paymentSettings.minWithdrawal) {
      setAmount(maxAmount.toString());
    } else {
      setError(`Insufficient balance. Minimum withdrawal is ₹${paymentSettings.minWithdrawal}`);
    }
  };

  // Handle amount input - no leading zeros
  const handleAmountChange = (e) => {
    let value = e.target.value;
    // Remove leading zeros
    value = value.replace(/^0+/, '');
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setAmount(value);
    }
  };

  const steps = [
    { id: 1, label: "Amount", icon: Banknote, active: amountNum >= paymentSettings.minWithdrawal },
    { id: 2, label: "Bank Details", icon: Building2, active: hasBankAccount === true },
    { id: 3, label: "Verification", icon: ShieldCheck, active: false },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 px-4 md:px-0">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Withdraw Funds</h1>
          <p className="text-slate-500 mt-2 font-medium">Move your earnings to your bank account instantly.</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-5 py-3 rounded-2xl text-xs font-black border border-indigo-100 shadow-sm">
          <Zap className="w-4 h-4 fill-indigo-700" />
          FAST PAYOUT ENABLED
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0 hidden md:block"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:text-center group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm
                ${step.active ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 shadow-lg' : 'bg-white border-slate-200 text-slate-400'}`}>
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Step 0{step.id}</p>
                <p className="text-sm font-bold text-slate-700">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden">

            {/* Notifications */}
            {successMessage && (
              <div className="flex items-center gap-3 text-emerald-700 text-sm font-bold bg-emerald-50 p-5 rounded-2xl border border-emerald-100 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5" /> {successMessage}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 text-rose-600 text-sm font-bold bg-rose-50 p-5 rounded-2xl border border-rose-100 animate-in shake">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            {/* Amount Input */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
                  Enter Amount <span className="text-slate-300">(Min: ₹{paymentSettings.minWithdrawal})</span>
                </label>
                <button onClick={withdrawFull} className="text-xs font-black text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4">
                  WITHDRAW ALL
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                  <IndianRupee className="h-8 w-8 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  className="block w-full pl-16 pr-8 py-8 bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] text-4xl font-black text-slate-800 focus:ring-0 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                  placeholder="0"
                />
              </div>
              {amountNum > 0 && amountNum < paymentSettings.minWithdrawal && (
                <p className="text-xs text-amber-600 font-medium px-2">
                  ⚠️ Minimum amount is ₹{paymentSettings.minWithdrawal}
                </p>
              )}
            </div>

            {/* Bank Fields */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">Bank Destination</label>
                {hasBankAccount && (
                  <Link to="/user/add-bank-account" className="text-xs font-black text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-4">
                    CHANGE BANK
                  </Link>
                )}
              </div>

              {/* Loading State */}
              {bankLoading && (
                <div className="flex items-center justify-center py-8 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* No Bank Account */}
              {!bankLoading && !hasBankAccount && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-amber-800 mb-2">No Bank Account Added</h3>
                  <p className="text-xs text-amber-600 mb-4">Please add your bank details first to withdraw funds.</p>
                  <Link
                    to="/user/add-bank-account"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Bank Account
                  </Link>
                </div>
              )}

              {/* Bank Details Display */}
              {!bankLoading && hasBankAccount && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-semibold">Linked Bank Account</p>
                      <p className="text-sm font-bold text-emerald-900">{bankName || "Bank Account"}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/60 rounded-xl p-4 border border-emerald-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Account Holder</p>
                      <p className="text-sm font-bold text-slate-800">{accountName}</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 border border-emerald-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Account Number</p>
                      <p className="text-sm font-bold text-slate-800 font-mono">
                        ••••••{accountNumber.slice(-4)}
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-4 border border-emerald-100 md:col-span-2">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">IFSC Code</p>
                      <p className="text-sm font-bold text-slate-800 font-mono tracking-widest">{ifsc}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading || !amountNum || amountNum < paymentSettings.minWithdrawal || !hasBankAccount}
              className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-100 disabled:text-slate-400 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-[0.98] disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Confirm Payout <ArrowRight className="w-6 h-6" /></>
              )}
            </button>
          </div>
        </div>

        {/* Summary Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden text-white group border border-slate-800">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>

            <Wallet className="w-12 h-12 mb-8 text-indigo-400" />
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Current Wallet</p>
            <h2 className="text-5xl font-black mt-3 tracking-tighter italic">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>

            <div className="mt-10 space-y-4 bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-xl">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Withdrawal Amount</span>
                <span>₹{amountNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">Platform Fee ({paymentSettings.commissionRate}%)</span>
                <span className="text-rose-400">+ ₹{platformFee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-white/10 my-2"></div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400">You'll Receive</span>
                <span className="text-emerald-400">₹{amountNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm font-black">
                <span className="text-indigo-400">Total Deduction</span>
                <span className="text-2xl text-white">₹{totalDeduction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
            <h4 className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest">
              <Info className="w-4 h-4 text-indigo-500" /> Withdrawal Rules
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">Requests are processed within <span className="text-slate-900 font-bold">24-48 business hours</span>.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">Min: <span className="text-slate-900 font-bold">₹{paymentSettings.minWithdrawal}</span> | Max: <span className="text-slate-900 font-bold">₹{paymentSettings.maxWithdrawal.toLocaleString()}</span></p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">Double check bank details. We cannot reverse completed transfers.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Withdraw;