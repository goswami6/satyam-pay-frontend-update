import { useSearchParams, Link } from "react-router-dom";
import { XCircle, RefreshCw, Home, AlertTriangle } from "lucide-react";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const linkId = searchParams.get("linkId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Failed Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-red-200/50 overflow-hidden text-center">
          {/* Failed Icon */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-10">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
              <XCircle className="w-14 h-14 text-red-500" />
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-4">
            <h1 className="text-3xl font-black text-slate-900">Payment Failed</h1>
            <p className="text-slate-500">
              Unfortunately, your payment could not be processed. Please try again.
            </p>

            {/* Warning Icon */}
            <div className="py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <p className="text-sm text-slate-400">
              No amount has been deducted from your account.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {linkId && (
                <Link
                  to={`/pay/${linkId}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-2xl font-bold text-sm transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Link>
              )}
              <a
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-4 px-6 rounded-2xl font-bold text-sm transition-all"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Powered by <span className="font-bold text-red-600">SatyamPay</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
