import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { authAPI } from "../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setIsSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to:
            </p>
            
            <div className="bg-blue-50 rounded-lg px-4 py-3 mb-6">
              <p className="text-blue-700 font-medium">{email}</p>
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Click the link in the email to reset your password. 
              The link will expire in 1 hour.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setIsSuccess(false)}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Send Again
              </button>
              
              <Link
                to="/login"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </div>

            {/* Help Text */}
            <p className="text-xs text-gray-400 mt-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Form State
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-md space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              SP
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-600">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your registered email"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              <>
                <Send size={18} />
                Send Reset Link
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
