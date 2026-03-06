import React from 'react';
import { 
  ChevronRight, CreditCard, Wallet, Send, Zap, Landmark, 
  Calendar, BookOpen, FileText, Code, Shield, ArrowRight,
  Repeat, Smartphone, Globe, BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MegaMenu = ({ menuId }) => {
  const megaMenuData = {
    payments: {
      title: 'Accept Payments',
      subtitle: 'Comprehensive payment solutions for your business',
      columns: [
        {
          title: 'Payment Methods',
          items: [
            { label: 'Credit & Debit Cards', icon: CreditCard, desc: 'Visa, Mastercard, RuPay, Amex', badge: 'Popular', path: '/payment-methods/credit-debit-cards' },
            { label: 'UPI Payments', icon: Send, desc: 'Google Pay, PhonePe, PayTM', badge: 'Instant', path: '/payment-methods/upi-payments' },
            { label: 'Digital Wallets', icon: Wallet, desc: 'PayTM, PhonePe, Amazon Pay', path: '/payment-methods/digital-wallets' },
            { label: 'Net Banking', icon: Landmark, desc: 'All major Indian banks', badge: '350+ Banks', path: '/payment-methods/net-banking' },
            { label: 'EMI Options', icon: Calendar, desc: 'No-cost & standard EMI', path: '/payment-methods/emi-options' },
          ],
        },
        {
          title: 'Features',
          items: [
            { label: 'Payment Links', icon: Smartphone, desc: 'Share links via SMS/Email', path: '/features/payment-links' },
            { label: 'Payment Pages', icon: Globe, desc: 'Customizable checkout', path: '/features/payment-pages' },
            { label: 'Analytics', icon: BarChart, desc: 'Real-time insights', badge: 'New', path: '/features/analytics' },
            { label: 'Security Suite', icon: Shield, desc: 'PCI-DSS compliant', path: '/features/security' },
          ],
        },
      ],
      footer: {
        text: 'View all payment solutions',
        link: '/payment-methods',
      }
    },

    resources: {
      title: 'Developer Resources',
      subtitle: 'Everything you need to build and scale',
      columns: [
        {
          title: 'Documentation',
          items: [
            { label: 'API Reference', icon: Code, desc: 'Complete API documentation', badge: 'RESTful', path: '/api-documentation' },
            // { label: 'Payin API', icon: ArrowRight, desc: 'Receive payments guide', path: '/api-documentation/payin' },
            // { label: 'Payout API', icon: ArrowRight, desc: 'Send payments guide', path: '/payout-api-documentation' },
            // { label: 'Webhooks', icon: Zap, desc: 'Event notifications', path: '/docs/webhooks' },
          ],
        },
        // {
        //   title: 'Guides',
        //   items: [
        //     { label: 'Quick Start', icon: BookOpen, desc: 'Go live in minutes', badge: '5 min', path: '/docs/quick-start' },
        //     { label: 'Integration Guide', icon: FileText, desc: 'Step-by-step tutorials', path: '/docs/integration' },
        //     { label: 'Best Practices', icon: Shield, desc: 'Security & optimization', path: '/docs/best-practices' },
        //   ],
        // },
      ],
      footer: {
        text: 'Explore documentation',
        link: '/api-documentation',
      }
    },
  };

  const data = megaMenuData[menuId];

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      // Hidden on mobile, shown on desktop with responsive width
      className="hidden lg:block bg-white shadow-2xl border border-gray-100 rounded-2xl w-[680px] xl:w-[800px] overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 xl:px-8 pt-6 xl:pt-8 pb-3 xl:pb-4 border-b border-gray-100">
        <h3 className="text-lg xl:text-xl font-bold text-gray-900 mb-1">{data.title}</h3>
        <p className="text-xs text-gray-500">{data.subtitle}</p>
      </div>

      {/* Two Column Grid */}
      <div className="px-6 xl:px-8 py-4 xl:py-6">
        <div className="grid grid-cols-2 gap-4 xl:gap-6">
          {data.columns.map((column, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 xl:mb-3">
                {column.title}
              </h4>
              <ul className="space-y-0.5">
                {column.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      to={item.path || '#'}
                      className="flex items-start gap-2 xl:gap-3 p-2 xl:p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 transition-all group"
                    >
                      <div className="flex-shrink-0 w-6 h-6 xl:w-7 xl:h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                        {item.icon && <item.icon size={12} xl:size={14} className="text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 xl:gap-2 flex-wrap">
                          <span className="font-medium text-xs text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className={`text-[8px] xl:text-[10px] font-semibold px-1 xl:px-1.5 py-0.5 rounded-full ${
                              item.badge === 'Popular' ? 'bg-orange-100 text-orange-700' :
                              item.badge === 'New' ? 'bg-green-100 text-green-700' :
                              item.badge === 'Instant' ? 'bg-purple-100 text-purple-700' :
                              item.badge === '350+ Banks' ? 'bg-blue-100 text-blue-700' :
                              item.badge === 'RESTful' ? 'bg-indigo-100 text-indigo-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight size={10} xl:size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </div>
                        {item.desc && (
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{item.desc}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      {data.footer && (
        <div className="px-6 xl:px-8 py-3 xl:py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
          <Link 
            to={data.footer.link}
            className="inline-flex items-center gap-1 xl:gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors group"
          >
            {data.footer.text}
            <ChevronRight size={12} xl:size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default MegaMenu;