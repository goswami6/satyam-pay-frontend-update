import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Users,
  Package,
  Settings,
  TrendingUp,
  FileWarning,
  ShieldCheck,
  MessageCircle,
  CreditCard,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import AdminSection from './AdminSection';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile visibility
  const [expandedSections, setExpandedSections] = useState({
    transactions: true,
    settlements: true,
    reports: true,
    users: true,
    products: true,
    system: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarItems = {
    dashboard: [
      { icon: LayoutDashboard, label: 'Overview', path: '/admin' }
    ],
    transactions: [
      { icon: ArrowLeftRight, label: 'Manage Payout', path: '/admin/payout' },
      { icon: Wallet, label: 'Withdraw Management', path: '/admin/withdraw-management' },
      { icon: FileWarning, label: 'Manage Bulk Payouts', path: '/admin/bulk-payouts' }
    ],
    settlements: [
      { icon: Wallet, label: 'All Settlements', path: '/admin/settlements' }
    ],
    reports: [
      { icon: TrendingUp, label: 'Reports', path: '/admin/reports' }
    ],
    users: [
      { icon: Users, label: 'All Users', path: '/admin/users' },
      { icon: ShieldCheck, label: 'KYC Management', path: '/admin/kyc-management' },
      { icon: MessageCircle, label: 'Support Chats', path: '/admin/support' }
    ],
    products: [
      { icon: Package, label: 'Products', path: '/admin/products' }
    ],
    system: [
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
      { icon: CreditCard, label: 'Payment Gateway', path: '/admin/payment-gateway' }
    ]
  };

  const SidebarLink = ({ icon: Icon, label, path }) => (
    <NavLink
      to={path}
      end={path === '/admin'}
      onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking
      className={({ isActive }) =>
        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`
      }
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* --- Mobile Toggle Button (Menu only - shown when sidebar closed) --- */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-3 sm:top-4 left-3 sm:left-4 z-50 p-1.5 sm:p-2 bg-gray-900 text-white rounded-md border border-gray-700 shadow-lg"
        >
          <Menu size={20} className="sm:w-6 sm:h-6" />
        </button>
      )}

      {/* --- Mobile Overlay --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-[260px] sm:w-[280px] bg-gray-900 border-r border-gray-800 flex flex-col h-screen transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-gray-400 mt-1">Full Control Access</p>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          <AdminSection title="DASHBOARD">
            {sidebarItems.dashboard.map((item) => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </AdminSection>

          <AdminSection
            title="TRANSACTION MANAGEMENT"
            isExpanded={expandedSections.transactions}
            onToggle={() => toggleSection('transactions')}
          >
            {expandedSections.transactions && sidebarItems.transactions.map((item) => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </AdminSection>

          <AdminSection
            title="SETTLEMENT MANAGEMENT"
            isExpanded={expandedSections.settlements}
            onToggle={() => toggleSection('settlements')}
          >
            {expandedSections.settlements && sidebarItems.settlements.map((item) => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </AdminSection>

          <AdminSection
            title="REPORTS"
            isExpanded={expandedSections.reports}
            onToggle={() => toggleSection('reports')}
          >
            {expandedSections.reports && sidebarItems.reports.map((item) => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </AdminSection>

          <AdminSection
            title="USER MANAGEMENT"
            isExpanded={expandedSections.users}
            onToggle={() => toggleSection('users')}
          >
            {expandedSections.users && sidebarItems.users.map((item) => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </AdminSection>

          <AdminSection
            title="PAYMENT PRODUCTS CONTROL"
            isExpanded={expandedSections.products}
            onToggle={() => toggleSection('products')}
          >
            {expandedSections.products && sidebarItems.products.map((item) => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </AdminSection>

          <AdminSection
            title="SYSTEM MANAGEMENT"
            isExpanded={expandedSections.system}
            onToggle={() => toggleSection('system')}
          >
            {expandedSections.system && sidebarItems.system.map((item) => (
              <SidebarLink key={item.path} {...item} />
            ))}
          </AdminSection>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;