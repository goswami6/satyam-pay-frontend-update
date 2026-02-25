import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import UserLayout from '../components/user/UserLayout';
import AdminLayout from '../components/admin/AdminLayout';

// Auth Pages
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Home from '../pages/Home';
import Pricing from '../pages/Pricing';
import Contact from '../pages/Contact';

// User Pages
import UserDashboard from '../pages/user/Dashboard';
import UserTransactions from '../pages/user/Transactions';
import UserSettlements from '../pages/user/Settlements';
import UserReports from '../pages/user/Reports';
import UserQRCodes from '../pages/user/QRCodes';

// Admin Pages
import AdminOverview from '../pages/admin/Overview';
import AdminUsers from '../pages/admin/Users';
import BlockedUsers from '../pages/admin/BlockedUsers';
import AdminTransactions from '../pages/admin/Transactions';
import AdminReports from '../pages/admin/Reports';
import AdminSettings from '../pages/admin/Settings';
import Register from '../pages/Registration';
import Deposit from '../pages/user/Deposit';
import RequestMoney from '../pages/user/RequestMoney';
import Withdraw from '../pages/user/Withdraw';
import BulkPayout from '../pages/user/BulkPayout';
import RequestMoneyGenerateLink from '../pages/user/RequestMoneyGenerateLink';
import UserProfile from '../pages/user/UserProfile';
import PayoutNow from '../pages/user/PayoutNow';
import APIToken from '../pages/user/APIToken';
import PayoutAPIToken from '../pages/user/PayoutAPIToken';
import RequestPayout from '../pages/user/RequestPayout';
import APIDocumentation from '../pages/user/APIDocumentation';
import PayoutAPIDocumentation from '../pages/user/PayoutAPIDocumentation';
import APITokenRequests from '../pages/admin/APITokenRequests';
import AdminPayoutRequests from '../pages/admin/AdminPayoutRequests';
import AdminPayoutManagement from '../pages/admin/AdminPayoutManagement';
import UserDetail from '../pages/admin/UserDetail';
import BulkPayoutManagement from '../pages/admin/BulkPayoutManagement';
import WithdrawManagement from '../pages/admin/WithdrawManagement';

import KYCManagement from '../pages/admin/KYCManagement';
import RejectedKYC from '../pages/admin/RejectedKYC';
import AdminSupport from '../pages/admin/Support';
import PaymentGatewaySettings from '../pages/admin/PaymentGatewaySettings';
import AdminQRManagement from '../pages/admin/QRManagement';
import AdminEnquiries from '../pages/admin/Enquiries';

// Payment Pages (Public)
import PaymentCheckout from '../pages/PaymentCheckout';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailed from '../pages/PaymentFailed';
import QRCheckout from '../pages/QRCheckout';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is user and trying to access admin panel, redirect to user panel
  if (requiredRole === 'admin' && role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/register" element={<Register />} />

      {/* Payment Checkout Routes (Public) */}
      <Route path="/pay/:linkId" element={<PaymentCheckout />} />
      <Route path="/qr/:qrId" element={<QRCheckout />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/failed" element={<PaymentFailed />} />

      {/* Dashboard redirect for authenticated users */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Navigate to={role === 'admin' ? '/admin' : '/user'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* User Panel Routes */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="transactions" element={<UserTransactions />} />
        <Route path="deposit-money" element={<Deposit />} />
        <Route path="request-money" element={<RequestMoney />} />
        <Route path="withdraw-money" element={<Withdraw />} />
        <Route path="payout-now" element={<PayoutNow />} />
        <Route path="bulk-payout" element={<BulkPayout />} />
        <Route path="settlements" element={<UserSettlements />} />
        <Route path="reports" element={<UserReports />} />
        <Route path="generate-links" element={<RequestMoneyGenerateLink />} />
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="qr-codes" element={<UserQRCodes />} />
        <Route path="api-token" element={<APIToken />} />
        <Route path="payout-api-token" element={<PayoutAPIToken />} />
        <Route path="request-payout" element={<RequestPayout />} />
      </Route>

      {/* API Documentation - Separate Full Page (Public) */}
      <Route path="/api-documentation" element={<APIDocumentation />} />
      <Route path="/payout-api-documentation" element={<PayoutAPIDocumentation />} />

      {/* Admin Panel Routes - Only for Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="blocked-users" element={<BlockedUsers />} />
        <Route path="kyc-management" element={<KYCManagement />} />
        <Route path="kyc-rejected" element={<RejectedKYC />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="payout" element={<AdminPayoutManagement />} />
        <Route path="bulk-payouts" element={<BulkPayoutManagement />} />
        <Route path="withdraw-management" element={<WithdrawManagement />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="payment-gateway" element={<PaymentGatewaySettings />} />
        <Route path="qr-codes" element={<AdminQRManagement />} />
        <Route path="api-token-requests" element={<APITokenRequests />} />
        <Route path="payout-requests" element={<AdminPayoutRequests />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
      </Route>

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
