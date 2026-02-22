import React from 'react';
import { Clock, CheckCircle, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const KYCPending = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-12 h-12 text-amber-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          KYC Verification In Progress
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Your documents have been submitted successfully and are under review.
        </p>

        {/* Timeline */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-gray-700">Documents Submitted</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-gray-700 font-medium">Under Review</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
            <span>Verification Complete</span>
          </div>
        </div>

        {/* Time Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <p className="text-blue-800 font-medium">
            ⏱️ Expected Time: 24-48 Hours
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Our team will verify your documents and notify you once approved.
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-gray-500 mb-2">Submitted as:</p>
          <p className="font-medium text-gray-900">{user?.fullName}</p>
          <div className="flex items-center gap-2 mt-2 text-gray-600 text-sm">
            <Mail size={14} />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
            <Phone size={14} />
            <span>{user?.phone}</span>
          </div>
        </div>

        {/* Support Info */}
        <p className="text-gray-500 text-sm mb-6">
          Need help? Contact us at{' '}
          <a href="mailto:support@satyampay.com" className="text-indigo-600 hover:underline">
            support@satyampay.com
          </a>
        </p>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default KYCPending;
