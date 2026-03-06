import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Suspense, lazy } from 'react';

// ✅ Loading Spinner Component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

// ✅ Layouts - Keep synchronous for faster initial render
import UserLayout from '../components/user/UserLayout';
import AdminLayout from '../components/admin/AdminLayout';

// ✅ Auth Pages - Lazy loaded
const Login = lazy(() => import('../pages/Login'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const Register = lazy(() => import('../pages/Registration'));

// ✅ Public Pages - Lazy loaded
const Home = lazy(() => import('../pages/Home'));
const Pricing = lazy(() => import('../pages/Pricing'));
const Contact = lazy(() => import('../pages/Contact'));
const Company = lazy(() => import('../pages/Company'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const PaymentMethod = lazy(() => import('../pages/PaymentMethod'));

// ✅ Payment Pages - Lazy loaded
const PaymentCheckout = lazy(() => import('../pages/PaymentCheckout'));
const PaymentSuccess = lazy(() => import('../pages/PaymentSuccess'));
const PaymentFailed = lazy(() => import('../pages/PaymentFailed'));
const QRCheckout = lazy(() => import('../pages/QRCheckout'));

// ✅ User Pages - Lazy loaded
const UserDashboard = lazy(() => import('../pages/user/Dashboard'));
const UserTransactions = lazy(() => import('../pages/user/Transactions'));
const UserSettlements = lazy(() => import('../pages/user/Settlements'));
const UserReports = lazy(() => import('../pages/user/Reports'));
const UserQRCodes = lazy(() => import('../pages/user/QRCodes'));
const Deposit = lazy(() => import('../pages/user/Deposit'));
const RequestMoney = lazy(() => import('../pages/user/RequestMoney'));
const Withdraw = lazy(() => import('../pages/user/Withdraw'));
const BulkPayout = lazy(() => import('../pages/user/BulkPayout'));
const RequestMoneyGenerateLink = lazy(() => import('../pages/user/RequestMoneyGenerateLink'));
const UserProfile = lazy(() => import('../pages/user/UserProfile'));
const PayoutNow = lazy(() => import('../pages/user/PayoutNow'));
const APIToken = lazy(() => import('../pages/user/APIToken'));
const PayoutAPIToken = lazy(() => import('../pages/user/PayoutAPIToken'));
const RequestPayout = lazy(() => import('../pages/user/RequestPayout'));
const APIDocumentation = lazy(() => import('../pages/user/APIDocumentation'));
const PayoutAPIDocumentation = lazy(() => import('../pages/user/PayoutAPIDocumentation'));

// ✅ Admin Pages - Lazy loaded
const AdminOverview = lazy(() => import('../pages/admin/Overview'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const BlockedUsers = lazy(() => import('../pages/admin/BlockedUsers'));
const AdminTransactions = lazy(() => import('../pages/admin/Transactions'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));
const APITokenRequests = lazy(() => import('../pages/admin/APITokenRequests'));
const AdminPayoutRequests = lazy(() => import('../pages/admin/AdminPayoutRequests'));
const AdminPayoutManagement = lazy(() => import('../pages/admin/AdminPayoutManagement'));
const UserDetail = lazy(() => import('../pages/admin/UserDetail'));
const BulkPayoutManagement = lazy(() => import('../pages/admin/BulkPayoutManagement'));
const WithdrawManagement = lazy(() => import('../pages/admin/WithdrawManagement'));
const KYCManagement = lazy(() => import('../pages/admin/KYCManagement'));
const RejectedKYC = lazy(() => import('../pages/admin/RejectedKYC'));
const AdminSupport = lazy(() => import('../pages/admin/Support'));
const PaymentGatewaySettings = lazy(() => import('../pages/admin/PaymentGatewaySettings'));
const AdminQRManagement = lazy(() => import('../pages/admin/QRManagement'));
const AdminEnquiries = lazy(() => import('../pages/admin/Enquiries'));
const AdminReceipts = lazy(() => import('../pages/admin/Receipts'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));

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
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<Company />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
        {/* Payment method description pages */}
        <Route path="/payment-methods/:method" element={<PaymentMethod />} />

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
          <Route path="profile" element={<AdminProfile />} />
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
          <Route path="receipts" element={<AdminReceipts />} />
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
    </Suspense>
  );
};

export default AppRoutes;
