import { useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const alreadyPaid = searchParams.get("already") === "true";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-200/50 overflow-hidden text-center">
          {/* Success Icon */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle className="w-14 h-14 text-emerald-500" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            <h1 className="text-3xl font-black text-slate-900">
              {alreadyPaid ? "Already Paid!" : "Payment Successful!"}
            </h1>
            <p className="text-slate-500">
              {alreadyPaid
                ? "This payment has already been completed."
                : "Thank you for your payment. Your transaction has been processed successfully."}
            </p>

            {/* Success Animation */}
            <div className="py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <span className="text-3xl">🎉</span>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              A confirmation email has been sent to your email address.
            </p>

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
