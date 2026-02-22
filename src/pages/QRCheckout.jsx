import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IndianRupee,
  Loader,
  ShieldCheck,
  User,
  FileText,
  Clock,
  XCircle,
  QrCode,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const QRCheckout = () => {
  const { qrId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const timerRef = useRef(null);

  const [payerInfo, setPayerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchQRDetails();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [qrId]);

  useEffect(() => {
    if (remainingTime > 0 && !qrData?.isStatic) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setError("QR Code has expired");
            setErrorStatus("expired");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [remainingTime, qrData?.isStatic]);

  const fetchQRDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/qr/checkout/${qrId}`);
      setQrData(response.data.qrCode);
      setRemainingTime(response.data.qrCode.remainingSeconds);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.status === "paid") {
        navigate(`/payment/success?qrId=${qrId}&already=true`);
      } else {
        setError(errorData?.message || "QR Code not found");
        setErrorStatus(errorData?.status);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    if (!payerInfo.name.trim()) {
      return alert("Please enter your name");
    }

    // For static QR, validate custom amount
    const paymentAmount = qrData.isStatic ? Number(customAmount) : qrData.amount;
    if (qrData.isStatic && (!customAmount || paymentAmount <= 0)) {
      return alert("Please enter a valid amount");
    }

    try {
      setProcessing(true);

      // Create order (pass amount for static QR)
      const orderResponse = await axios.post(`${API_URL}/api/qr/checkout/create-order`, {
        qrId,
        amount: qrData.isStatic ? paymentAmount : undefined,
      });

      if (!orderResponse.data.success) {
        throw new Error(orderResponse.data.message || "Failed to create order");
      }

      const data = orderResponse.data;

      if (data.gateway === "payu" && data.payuData) {
        // PayU redirect flow - create hidden form and submit
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.payuData.payuUrl;
        // Add payer info to PayU params
        const payuFields = {
          ...data.payuData,
          firstname: payerInfo.name,
          email: payerInfo.email || data.payuData.email,
          phone: payerInfo.phone || "",
        };
        Object.entries(payuFields).forEach(([key, value]) => {
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
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Failed to load payment gateway");
      }

      const { order, key } = data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "SatyamPay",
        description: qrData.description || "QR Payment",
        order_id: order.id,
        prefill: {
          name: payerInfo.name,
          email: payerInfo.email,
          contact: payerInfo.phone,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${API_URL}/api/qr/checkout/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              qrId,
              payerName: payerInfo.name,
              payerEmail: payerInfo.email,
              payerPhone: payerInfo.phone,
            });

            if (verifyResponse.data.success) {
              navigate(`/payment/success?qrId=${qrId}`);
            } else {
              navigate(`/payment/failed?qrId=${qrId}`);
            }
          } catch (err) {
            navigate(`/payment/failed?qrId=${qrId}`);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function () {
        navigate(`/payment/failed?qrId=${qrId}`);
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {errorStatus === "expired" ? (
              <Clock className="w-8 h-8 text-red-500" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {errorStatus === "expired" ? "QR Code Expired" : "Invalid QR Code"}
          </h1>
          <p className="text-slate-500">{error}</p>
          {errorStatus === "expired" && (
            <p className="text-sm text-slate-400 mt-4">
              Please request a new QR code from the merchant.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <QrCode className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-black text-indigo-600 tracking-tight">SatyamPay</h1>
          </div>
          <p className="text-slate-500 text-sm">Secure QR Payment</p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-200/50 overflow-hidden">
          {/* Timer Bar - Only for dynamic QR */}
          {!qrData.isStatic && remainingTime > 0 && (
            <div className={`p-3 text-center ${remainingTime < 60 ? "bg-red-500" : "bg-amber-500"}`}>
              <div className="flex items-center justify-center gap-2 text-white">
                <Clock className="w-4 h-4" />
                <span className="font-bold text-sm">
                  Expires in: {formatTime(remainingTime)}
                </span>
              </div>
            </div>
          )}

          {/* Amount Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
            {qrData.isStatic ? (
              <>
                <p className="text-indigo-200 text-sm font-medium mb-3">Enter Amount to Pay</p>
                <div className="flex items-center justify-center gap-2">
                  <IndianRupee className="w-8 h-8 text-white/70" />
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0"
                    className="bg-transparent text-5xl font-black text-center outline-none w-48 placeholder:text-white/30"
                    autoFocus
                  />
                </div>
                <p className="text-indigo-200/70 text-xs mt-3 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  No expiry - Pay any amount
                </p>
              </>
            ) : (
              <>
                <p className="text-indigo-200 text-sm font-medium mb-2">Amount to Pay</p>
                <div className="flex items-center justify-center gap-1">
                  <IndianRupee className="w-10 h-10" />
                  <span className="text-5xl font-black">
                    {Number(qrData.amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            {qrData.description && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</p>
                  <p className="text-sm text-slate-700 font-medium mt-1">{qrData.description}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment To</p>
                <p className="text-sm text-slate-700 font-medium mt-1">{qrData.merchant}</p>
              </div>
            </div>

            {/* Payer Info */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Details</p>
              <input
                type="text"
                placeholder="Your Name *"
                value={payerInfo.name}
                onChange={(e) => setPayerInfo({ ...payerInfo, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
              />
              <input
                type="email"
                placeholder="Email (Optional)"
                value={payerInfo.email}
                onChange={(e) => setPayerInfo({ ...payerInfo, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
              />
              <input
                type="tel"
                placeholder="Phone (Optional)"
                value={payerInfo.phone}
                onChange={(e) => setPayerInfo({ ...payerInfo, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
              />
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-3 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold">100% Secure Payment</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={processing || (!qrData.isStatic && remainingTime === 0) || (qrData.isStatic && !customAmount)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : !qrData.isStatic && remainingTime === 0 ? (
                "QR Expired"
              ) : (
                <>Pay ₹{(qrData.isStatic ? Number(customAmount) || 0 : Number(qrData.amount)).toLocaleString("en-IN")} Now</>
              )}
            </button>

            {/* Payment Methods */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-400 font-medium">
                Pay securely via UPI, Cards, or Net Banking
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Powered by <span className="font-bold text-indigo-600">SatyamPay</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCheckout;
