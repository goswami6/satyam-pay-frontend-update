import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, Loader, XCircle, Home } from "lucide-react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const alreadyPaid = searchParams.get("already") === "true";
  const flow = searchParams.get("flow");
  const cfOrderId = searchParams.get("cf_order_id");
  const linkId = searchParams.get("linkId");
  const qrId = searchParams.get("qrId");
  const messageParam = searchParams.get("message");

  const successMessage = (() => {
    if (!messageParam) return "";
    try {
      return decodeURIComponent(messageParam);
    } catch {
      return messageParam;
    }
  })();

  const [verifying, setVerifying] = useState(Boolean(cfOrderId));
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    const verifyCashfreeReturn = async () => {
      if (!cfOrderId || !flow) {
        setVerifying(false);
        return;
      }

      try {
        setVerifying(true);
        setVerifyError("");

        await axios.post(`${API_URL}/api/payment/cashfree/verify-return`, {
          flow,
          orderId: cfOrderId,
          linkId,
          qrId,
        });
      } catch (error) {
        setVerifyError(
          error?.response?.data?.message || "Payment verification failed. Please contact support."
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyCashfreeReturn();
  }, [cfOrderId, flow, linkId, qrId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-200/50 overflow-hidden text-center">
          {/* Success Icon */}
          <div className={`p-10 ${verifyError ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-gradient-to-r from-emerald-500 to-green-500"}`}>
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
              {verifying ? (
                <Loader className="w-14 h-14 text-emerald-500 animate-spin" />
              ) : verifyError ? (
                <XCircle className="w-14 h-14 text-red-500" />
              ) : (
                <CheckCircle className="w-14 h-14 text-emerald-500" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            <h1 className="text-3xl font-black text-slate-900">
              {verifying ? "Verifying Payment..." : verifyError ? "Payment Verification Failed" : alreadyPaid ? "Already Paid!" : "Payment Successful!"}
            </h1>
            <p className="text-slate-500">
              {verifying
                ? "Please wait while we confirm your payment."
                : verifyError
                  ? verifyError
                  : alreadyPaid
                    ? "This payment has already been completed."
                    : successMessage || "Thank you for your payment. Your transaction has been processed successfully."}
            </p>

            {/* Success Animation */}
            <div className="py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <span className="text-3xl">🎉</span>
              </div>
            </div>

            {!verifyError && (
              <p className="text-sm text-slate-400">
                A confirmation email has been sent to your email address.
              </p>
            )}

            {/* Action Button */}
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white py-4 px-8 rounded-2xl font-bold text-sm transition-all mt-4"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Powered by <span className="font-bold text-emerald-600">SatyamPay</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
