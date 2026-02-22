import { Outlet } from 'react-router-dom';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';

const PaymentsLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavbar />
      <div className="flex pt-16 h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PaymentsLayout;
