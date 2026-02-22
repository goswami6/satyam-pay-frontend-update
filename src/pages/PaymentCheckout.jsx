import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IndianRupee,
  Loader,
  ShieldCheck,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PaymentCheckout = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPaymentDetails();
  }, [linkId]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/payment/checkout/${linkId}`);
      setPaymentData(response.data.paymentLink);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.status === "paid") {
        navigate(`/payment/success?linkId=${linkId}&already=true`);
      } else {
        setError(errorData?.message || "Payment link not found");
      }
    } finally {
      setLoading(false);
    }
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
    try {
      setProcessing(true);

      // Create order
      const orderResponse = await axios.post(`${API_URL}/api/payment/checkout/create-order`, {
        linkId,
      });

      const data = orderResponse.data;

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
        description: paymentData.description || "Payment",
        order_id: order.id,
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(`${API_URL}/api/payment/checkout/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              linkId,
            });

            if (verifyResponse.data.success) {
              navigate(`/payment/success?linkId=${linkId}`);
            } else {
              navigate(`/payment/failed?linkId=${linkId}`);
            }
          } catch (err) {
            navigate(`/payment/failed?linkId=${linkId}`);
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
        navigate(`/payment/failed?linkId=${linkId}`);
      });
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to initiate payment");
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
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Link Invalid</h1>
          <p className="text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-indigo-600 tracking-tight">SatyamPay</h1>
          <p className="text-slate-500 text-sm mt-1">Secure Payment Gateway</p>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-indigo-200/50 overflow-hidden">
          {/* Amount Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center text-white">
            <p className="text-indigo-200 text-sm font-medium mb-2">Amount to Pay</p>
            <div className="flex items-center justify-center gap-1">
              <IndianRupee className="w-10 h-10" />
              <span className="text-5xl font-black">
                {Number(paymentData.amount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            {paymentData.description && (
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <FileText className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</p>
                  <p className="text-sm text-slate-700 font-medium mt-1">{paymentData.description}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment To</p>
                <p className="text-sm text-slate-700 font-medium mt-1">{paymentData.merchant}</p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-3 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold">100% Secure Payment</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={processing}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {processing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{Number(paymentData.amount).toLocaleString("en-IN")} Now
                </>
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

export default PaymentCheckout;
