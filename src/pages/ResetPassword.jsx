import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../utils/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authAPI.verifyResetToken(token);
        if (response.data.valid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        setIsValidToken(false);
      } finally {
        setIsVerifying(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsVerifying(false);
      setIsValidToken(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword(token, { password });
      setIsSuccess(true);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading State
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid Token State
  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Invalid or Expired Link
            </h2>
            
            <p className="text-gray-600 mb-8">
              This password reset link is invalid or has expired. 
              Please request a new reset link.
            </p>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Request New Link
              </Link>
              
              <Link
                to="/login"
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
              Password Reset Successful!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Your password has been changed successfully. 
              You can now login with your new password.
            </p>

            {/* Actions */}
            <Link
              to="/login"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Go to Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Reset Password Form
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
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600">
            Create a strong new password for your account.
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

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Password Requirements:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li className={`flex items-center gap-2 ${password.length >= 6 ? "text-green-600" : ""}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? "bg-green-600" : "bg-gray-400"}`}></div>
                At least 6 characters
              </li>
              <li className={`flex items-center gap-2 ${password === confirmPassword && password.length > 0 ? "text-green-600" : ""}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${password === confirmPassword && password.length > 0 ? "bg-green-600" : "bg-gray-400"}`}></div>
                Passwords match
              </li>
            </ul>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Resetting...
              </span>
            ) : (
              "Reset Password"
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

export default ResetPassword;
