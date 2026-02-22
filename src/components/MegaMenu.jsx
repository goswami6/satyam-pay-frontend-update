import React from 'react';
import { ChevronRight, CreditCard, Wallet, Send, FileText, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const MegaMenu = ({ menuId }) => {
  const megaMenuData = {
    payments: {
      title: 'Accept Payments',
      columns: [
        {
          title: 'Payment Methods',
          items: [
            { label: 'Cards', icon: CreditCard },
            { label: 'Wallets', icon: Wallet },
            { label: 'UPI', icon: Send },
            { label: 'Recurring', icon: Zap },
          ],
        },
        {
          title: 'Solutions',
          items: [
            { label: 'Online Store', icon: null },
            { label: 'Invoices', icon: null },
            { label: 'Subscriptions', icon: null },
            { label: 'Donations', icon: null },
          ],
        },
      ],
      featured: {
        title: 'Payment Links',
        description: 'Create and share payment links instantly',
      },
    },
    banking: {
      title: 'Banking Solutions',
      columns: [
        {
          title: 'Features',
          items: [
            { label: 'Current Account', icon: null },
            { label: 'Virtual Accounts', icon: null },
            { label: 'Settlements', icon: null },
            { label: 'Payouts', icon: null },
          ],
        },
        {
          title: 'For Every Business',
          items: [
            { label: 'Startups', icon: null },
            { label: 'SMBs', icon: null },
            { label: 'Enterprises', icon: null },
            { label: 'Fintech', icon: null },
          ],
        },
      ],
      featured: {
        title: 'Smart Routing',
        description: 'Automatic payment route optimization',
      },
    },
    payroll: {
      title: 'Payroll Management',
      columns: [
        {
          title: 'Payroll Services',
          items: [
            { label: 'Salary Management', icon: null },
            { label: 'Compliance', icon: null },
            { label: 'Expense Tracking', icon: null },
            { label: 'Reports', icon: null },
          ],
        },
        {
          title: 'Employee Benefits',
          items: [
            { label: 'Health Insurance', icon: null },
            { label: 'Retirement Plans', icon: null },
            { label: 'Stock Options', icon: null },
            { label: 'Wellness', icon: null },
          ],
        },
      ],
      featured: {
        title: 'Compliance Ready',
        description: 'Fully compliant with Indian labour laws',
      },
    },
    engage: {
      title: 'Customer Engagement',
      columns: [
        {
          title: 'Tools',
          items: [
            { label: 'SMS & Email', icon: null },
            { label: 'Push Notifications', icon: null },
            { label: 'Customer Portal', icon: null },
            { label: 'Analytics', icon: null },
          ],
        },
        {
          title: 'Use Cases',
          items: [
            { label: 'Invoicing', icon: null },
            { label: 'Reminders', icon: null },
            { label: 'Communications', icon: null },
            { label: 'Feedback', icon: null },
          ],
        },
      ],
      featured: {
        title: 'Multi-Channel',
        description: 'Reach customers across all channels',
      },
    },
    partners: {
      title: 'Partner Programs',
      columns: [
        {
          title: 'For Partners',
          items: [
            { label: 'Referral Program', icon: null },
            { label: 'Integration Partner', icon: null },
            { label: 'Enterprise Partner', icon: null },
            { label: 'Technology Partner', icon: null },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Partner Portal', icon: null },
            { label: 'Documentation', icon: null },
            { label: 'Training', icon: null },
            { label: 'Support', icon: null },
          ],
        },
      ],
      featured: {
        title: 'Grow Together',
        description: 'Build and scale your business with Razorpay',
      },
    },
    resources: {
      title: 'Resources & Support',
      columns: [
        {
          title: 'Learn',
          items: [
            { label: 'Documentation', icon: null },
            { label: 'API Reference', icon: null },
            { label: 'Code Samples', icon: null },
            { label: 'SDKs', icon: null },
          ],
        },
        {
          title: 'Support',
          items: [
            { label: 'Help Center', icon: null },
            { label: 'Community', icon: null },
            { label: 'Contact Support', icon: null },
            { label: 'Status Page', icon: null },
          ],
        },
      ],
      featured: {
        title: 'Developer Friendly',
        description: 'Everything you need to integrate Razorpay',
      },
    },
  };

  const data = megaMenuData[menuId];

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 w-screen bg-white shadow-2xl border-t border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-12">
          {/* Menu Columns */}
          <div className="col-span-2 grid grid-cols-2 gap-12">
            {data.columns.map((column, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a
                        href="#"
                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition-colors group"
                      >
                        {item.icon && (
                          <item.icon size={18} className="flex-shrink-0" />
                        )}
                        <span className="font-medium group-hover:translate-x-1 transition-transform">
                          {item.label}
                        </span>
                        <ChevronRight
                          size={16}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Featured */}
          <div className="col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow cursor-pointer group">
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {data.featured.title}
              </h4>
              <p className="text-sm text-gray-600 mb-4">{data.featured.description}</p>
              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                Explore <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
