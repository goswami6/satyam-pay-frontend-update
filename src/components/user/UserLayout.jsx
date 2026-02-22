import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import UserTopbar from './UserTopbar';
import UserSidebar from './UserSidebar';
import { useAuth } from '../../context/AuthContext';
import KYCVerification from '../../pages/user/KYCVerification';
import KYCPending from '../../pages/user/KYCPending';
import { kycAPI } from '../../utils/api';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkKYCStatus = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await kycAPI.getStatus(user._id);
        setKycStatus(response.data.status);
      } catch (error) {
        console.error('Error checking KYC status:', error);
        setKycStatus('not_submitted');
      } finally {
        setLoading(false);
      }
    };

    checkKYCStatus();
  }, [user]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If KYC not submitted or rejected, show KYC form
  if (kycStatus === 'not_submitted' || kycStatus === 'rejected') {
    return <KYCVerification />;
  }

  // If KYC pending approval, show waiting page
  if (kycStatus === 'pending') {
    return <KYCPending />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]"> {/* Premium Slate-50 background */}
      {/* Sidebar - Width is w-72 */}
      <UserSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {/* Topbar - Left offset matches Sidebar width */}
      <UserTopbar toggleSidebar={toggleSidebar} />

      {/* Main Content:
          1. lg:ml-72 matches the Sidebar width (288px)
          2. pt-20 matches the Topbar height (80px)
      */}
      <main className="lg:ml-72 pt-20 min-h-screen transition-all duration-300">
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {/* Outlet renders the specific page content */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;