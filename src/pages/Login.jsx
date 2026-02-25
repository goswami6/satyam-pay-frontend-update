import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Shield, User as UserIcon } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../utils/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState("user"); // "user" or "admin"
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  // ✅ If already logged in → redirect
  if (isAuthenticated) {
    return (
      <Navigate
        to={role === "admin" ? "/admin" : "/user"}
        replace
      />
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Choose endpoint based on login type
      const response = loginType === "admin"
        ? await authAPI.adminLogin({ email, password })
        : await authAPI.login({ email, password });

      const { token, user } = response.data;

      // ✅ Update AuthContext properly
      login(token, user);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Login Failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">
            Log in to your SatyamPay account
          </p>
        </div>

        {/* Login Type Tabs */}
        <div className="flex gap-4 bg-white rounded-xl p-2 border border-gray-200">
          <button
            onClick={() => setLoginType("user")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${loginType === "user"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <UserIcon size={18} />
            User Login
          </button>
          <button
            onClick={() => setLoginType("admin")}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${loginType === "admin"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            <Shield size={18} />
            Admin Login
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white rounded-2xl border border-gray-200 p-8 shadow-lg"
        >
          {/* Submit Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold">
              Email Address
            </label>
            <div className="relative mt-2">
              <Mail
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "", submit: "" });
                }}
                className="w-full pl-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold">
              Password
            </label>
            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "", submit: "" });
                }}
                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all ${loginType === "admin"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-blue-600 hover:bg-blue-700"
              } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer */}
        {loginType === "user" && (
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign up
            </a>
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
