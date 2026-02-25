import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  FileText,
  Link2,
  QrCode,
  X,
  ArrowDownCircle,
  ArrowUpCircle,
  Send,
  Layers,
  BarChart3,
  UserCircle,
  History,
  Key,
  BookOpen,
  MessageCircle,
  KeyRound
} from 'lucide-react';
import SupportChatModal from './SupportChatModal';

const UserSidebar = ({ isOpen, closeSidebar }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/user' },
    { icon: ArrowDownCircle, label: 'Deposit Money', path: '/user/deposit-money' },
    { icon: ArrowUpCircle, label: 'Request Money', path: '/user/request-money' },
    { icon: Send, label: 'Withdraw Money', path: '/user/withdraw-money' },
    { icon: CreditCard, label: 'Payout Now', path: '/user/payout-now' },
    { icon: Wallet, label: 'Request Payout', path: '/user/request-payout' },
    { icon: History, label: 'Transactions', path: '/user/transactions' },
    { icon: Layers, label: 'Bulk Payout', path: '/user/bulk-payout' },
    { icon: Wallet, label: 'Settlements', path: '/user/settlements' },
    { icon: BarChart3, label: 'Reports', path: '/user/reports' },
    { icon: Link2, label: 'Generate Links', path: '/user/generate-links' },
    // { icon: QrCode, label: 'QR Codes', path: '/user/qr-codes' },
    { icon: Key, label: 'API Token', path: '/user/api-token' },
    { icon: KeyRound, label: 'Payout API Token', path: '/user/payout-api-token' },
    { icon: UserCircle, label: 'User Profile', path: '/user/user-profile' },
  ];

  return (
    <>
      {/* Mobile Overlay - Z-index 40 to stay under the sidebar but over content */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar - z-50 to ensure it is clickable, but Layout handles the margin */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white z-50
        border-r border-slate-100 shadow-2xl lg:shadow-none
        transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

        {/* Header Section inside Sidebar */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-800 leading-tight">
                SatyamPay
              </span>
              <span className="text-indigo-600 text-[10px] uppercase font-bold tracking-[0.15em]">
                Enterprise
              </span>
            </div>
          </div>

          <button
            onClick={closeSidebar}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto px-4 pb-10 scrollbar-hide">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] my-4">
            Main Navigation
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/user'}
                onClick={closeSidebar}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`
                      w-5 h-5 transition-all duration-200 
                      ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 group-hover:text-indigo-500'}
                    `} />
                    <span className={`text-[14px] font-medium ${isActive ? 'translate-x-0.5 transition-transform' : ''}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Premium Footer Card */}
          <div className="mt-8 mx-2 p-5 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white text-sm font-semibold">Pro Support</p>
              <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">
                24/7 Priority support enabled for your account.
              </p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Agent
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Support Chat Modal */}
      <SupportChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default UserSidebar;