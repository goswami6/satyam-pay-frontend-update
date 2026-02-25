import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Download,
  Info,
  ArrowRight,
  FileText,
  X,
  Wallet,
  IndianRupee
} from "lucide-react";
import { paymentAPI, userAPI } from "../../utils/api";

const BulkPayout = () => {
  const { getUserId, getAuthHeader, getUserBalance } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [rowCount, setRowCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [balanceLoading, setBalanceLoading] = useState(true);

  const userId = getUserId() || sessionStorage.getItem("userId");

  // Fetch user's wallet balance
  useEffect(() => {
    const fetchBalance = async () => {
      if (!userId || userId === "null") return;
      try {
        setBalanceLoading(true);
        setBalance(getUserBalance());
        const { data } = await userAPI.getBalance(userId);
        if (data?.balance !== undefined) {
          setBalance(data.balance);
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err);
        setBalance(getUserBalance());
      } finally {
        setBalanceLoading(false);
      }
    };
    fetchBalance();
  }, [userId, getUserBalance]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only CSV or Excel files are allowed");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError("");

    // Parse CSV to calculate total amount
    if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const lines = text.split("\n").filter(line => line.trim());
          if (lines.length < 2) {
            setTotalAmount(0);
            setRowCount(0);
            return;
          }

          // Find amount column index
          const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
          const amountIndex = headers.findIndex(h => h === "amount");

          if (amountIndex === -1) {
            setError("❌ Amount column not found in CSV");
            setTotalAmount(0);
            setRowCount(0);
            return;
          }

          let total = 0;
          let validRows = 0;

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(",");
            if (cols.length > amountIndex) {
              const amount = parseFloat(cols[amountIndex].trim().replace(/[^0-9.]/g, ""));
              if (!isNaN(amount) && amount > 0) {
                total += amount;
                validRows++;
              }
            }
          }

          setTotalAmount(total);
          setRowCount(validRows);

          // Check against balance
          if (total > balance) {
            setError(`❌ Insufficient Balance! Total payout amount (₹${total.toLocaleString("en-IN")}) exceeds your wallet balance (₹${balance.toLocaleString("en-IN")})`);
          }
        } catch (err) {
          console.error("CSV parsing error:", err);
          setTotalAmount(0);
          setRowCount(0);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a file");
      return;
    }

    if (!userId || userId === "null") {
      setError("User ID not found. Please login again.");
      return;
    }

    // Check if total amount exceeds balance
    if (totalAmount > balance) {
      setError(`❌ Insufficient Balance! Total payout amount (₹${totalAmount.toLocaleString("en-IN")}) exceeds your wallet balance (₹${balance.toLocaleString("en-IN")})`);
      return;
    }

    if (totalAmount <= 0) {
      setError("❌ Invalid CSV file. No valid amount found.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await paymentAPI.bulkUpload(formData);

      setSuccessMessage("✓ File uploaded successfully. Admin will review within 24 hours.");
      console.log("✅ Upload response:", response.data);
      setFile(null);
      setTotalAmount(0);
      setRowCount(0);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      let errorMsg = error.response?.data?.message || error.message || "Upload failed";

      // Show detected columns if available
      if (error.response?.data?.detectedColumns?.length > 0) {
        errorMsg += `. Detected columns: ${error.response.data.detectedColumns.join(", ")}`;
      }

      setError("❌ " + errorMsg);
      console.error("Upload error:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download Sample Template
  const downloadSampleTemplate = () => {
    const csvContent = `Account Holder Name,Account Number,IFSC,Bank Name,Amount
John Doe,1234567890123456,HDFC0001234,HDFC Bank,100
Jane Smith,9876543210987654,ICIC0005678,ICICI Bank,200
Bob Wilson,1122334455667788,SBIN0009012,State Bank of India,150`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bulk_payout_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const steps = [
    { id: 1, label: "Prepare File", icon: FileText },
    { id: 2, label: "Upload CSV", icon: UploadCloud },
    { id: 3, label: "Admin Audit", icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">

      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bulk Payout</h1>
          <p className="text-slate-500 mt-1">Distribute payments to hundreds of recipients in one click.</p>
        </div>
        <button
          onClick={downloadSampleTemplate}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-2xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          Download Template
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-emerald-700">{successMessage}</p>
        </div>
      )}

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <step.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Step 0{step.id}</p>
                <p className="text-sm font-bold text-slate-700">{step.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Upload Zone */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">

            <div className="relative group">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                id="file-upload"
              />
              <div className={`border-2 border-dashed rounded-[2rem] p-10 transition-all duration-300 flex flex-col items-center justify-center text-center
                ${file ? 'border-indigo-500 bg-indigo-50/30' : 'border-slate-200 bg-slate-50/50 group-hover:border-indigo-300 group-hover:bg-white'}`}>

                {file ? (
                  <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200 mb-4">
                      <FileSpreadsheet className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 truncate max-w-xs">{file.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</p>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setFile(null); setTotalAmount(0); setRowCount(0); setError(""); }}
                      className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3 h-3" /> Remove File
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Choose file or drag here</h3>
                    <p className="text-sm text-slate-400 mt-1">Upload CSV or Excel (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Total Amount & Balance Summary */}
            {file && totalAmount > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Rows</p>
                    <p className="text-lg font-black text-slate-900">{rowCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${totalAmount > balance ? 'bg-red-100' : 'bg-emerald-100'}`}>
                    <IndianRupee className={`w-5 h-5 ${totalAmount > balance ? 'text-red-600' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Payout</p>
                    <p className={`text-lg font-black ${totalAmount > balance ? 'text-red-600' : 'text-slate-900'}`}>
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Your Balance</p>
                    <p className="text-lg font-black text-slate-900">
                      {balanceLoading ? "..." : `₹${balance.toLocaleString("en-IN")}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Insufficient Balance Warning */}
            {file && totalAmount > balance && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700">Insufficient Wallet Balance</p>
                  <p className="text-xs text-red-600 mt-1">
                    You need ₹{(totalAmount - balance).toLocaleString("en-IN")} more to process this bulk payout.
                    Please add funds to your wallet before submitting.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !file || totalAmount > balance || totalAmount <= 0}
              className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-100 disabled:text-slate-400 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? "Uploading to Server..." : totalAmount > balance ? "Insufficient Balance" : "Submit Bulk Payout"}
              {!loading && totalAmount <= balance && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

            <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
              <Info className="w-4 h-4" /> Formatting Rules
            </h4>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Required Columns</p>
                <div className="flex flex-wrap gap-2">
                  {["Account Holder Name", "Account Number", "IFSC", "Bank Name", "Amount"].map(col => (
                    <span key={col} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold">
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-indigo-300 uppercase mb-2">Pro Tip:</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    Ensure IFSC codes are valid and account numbers are correct to prevent payment failures.
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Once uploaded, our admin team will verify the funds and process payouts within <span className="text-white font-bold">24 business hours</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h5 className="text-sm font-bold text-amber-900">Validation Notice</h5>
              <p className="text-[11px] text-amber-800/70 leading-relaxed mt-1">
                Make sure your wallet balance covers the total sum of all rows plus any applicable gateway fees.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BulkPayout;