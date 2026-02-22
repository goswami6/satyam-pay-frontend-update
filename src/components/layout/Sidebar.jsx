import { useState } from 'react';
import { 
  Home, 
  ArrowLeftRight, 
  Wallet, 
  FileText, 
  CreditCard, 
  Link, 
  FileCode, 
  User, 
  Smartphone, 
  QrCode, 
  ChevronDown, 
  ChevronUp, 
  RotateCw, 
  GitBranch, 
  ShoppingCart, 
  Gift, 
  Zap, 
  Banknote, 
  Users, 
  Tag, 
  Code, 
  Package 
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import SidebarSection from './SidebarSection';

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);

  const primaryItems = [
    { icon: Home, label: 'Home', path: '/dashboard/payments' },
    { icon: ArrowLeftRight, label: 'Transactions', path: '/dashboard/payments/transactions' },
    { icon: Wallet, label: 'Settlements', path: '/dashboard/payments/settlements' },
    { icon: FileText, label: 'Reports', path: '/dashboard/payments/reports' },
  ];

  const paymentProducts = [
    { icon: FileCode, label: 'Digital Billing', path: '/dashboard/payments/digital-billing' },
    { icon: Link, label: 'Payment Links', path: '/dashboard/payments/payment-links' },
    { icon: CreditCard, label: 'Payment Pages', path: '/dashboard/payments/payment-pages' },
    { icon: User, label: 'Razorpay.me Link', path: '/dashboard/payments/razorpay-me' },
    { icon: Smartphone, label: 'POS', path: '/dashboard/payments/pos' },
    { icon: QrCode, label: 'QR Codes', path: '/dashboard/payments/qr-codes' },
  ];

  const expandedPaymentProducts = [
    { icon: RotateCw, label: 'Subscription', path: '/dashboard/payments/subscription' },
    { icon: Wallet, label: 'Smart Collect', path: '/dashboard/payments/smart-collect' },
    { icon: GitBranch, label: 'Route', path: '/dashboard/payments/route' },
    { icon: ShoppingCart, label: 'Checkout', path: '/dashboard/payments/checkout' },
    { icon: Gift, label: 'Rewards', path: '/dashboard/payments/rewards' },
    { icon: Zap, label: 'Magic Checkout', path: '/dashboard/payments/magic-checkout' },
  ];

  const bankingProducts = [
    { icon: Banknote, label: 'Payroll', path: '/dashboard/payments/payroll' },
  ];

  const customerProducts = [
    { icon: Users, label: 'Customers', path: '/dashboard/payments/customers' },
    { icon: Tag, label: 'Offers', path: '/dashboard/payments/offers' },
    { icon: Code, label: 'Developers', path: '/dashboard/payments/developers' },
    { icon: Package, label: 'Apps & Deals', path: '/dashboard/payments/apps-deals' },
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <nav className="py-4 px-3">
        <div className="space-y-1 mb-6">
          {primaryItems.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </div>

        <SidebarSection title="PAYMENT PRODUCTS">
          {paymentProducts.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
          
          <button
            onClick={() => setShowMore(!showMore)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="font-medium">Show More</span>
            {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showMore ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-1 mt-1">
              {expandedPaymentProducts.map((item) => (
                <SidebarItem key={item.path} {...item} />
              ))}
            </div>
          </div>
        </SidebarSection>

        <SidebarSection title="BANKING PRODUCTS">
          {bankingProducts.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </SidebarSection>

        <SidebarSection title="CUSTOMER PRODUCTS">
          {customerProducts.map((item) => (
            <SidebarItem key={item.path} {...item} />
          ))}
        </SidebarSection>
      </nav>
    </aside>
  );
};

export default Sidebar;
