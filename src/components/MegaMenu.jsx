import React from 'react';
import { ChevronRight, CreditCard, Wallet, Send, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MegaMenu = ({ menuId }) => {
  const megaMenuData = {
    payments: {
      title: 'Accept Payments',
      columns: [
        {
          title: 'Payment Methods',
          items: [
            { label: 'Credit & Debit Cards', icon: CreditCard, desc: 'Accept all major cards' },
            { label: 'Digital Wallets', icon: Wallet, desc: 'PayTM, PhonePe, Google Pay' },
            { label: 'UPI Payments', icon: Send, desc: 'Instant UPI transactions' },
            { label: 'Recurring Payments', icon: Zap, desc: 'Automated subscriptions' },
            { label: 'Net Banking', icon: null, desc: 'All major banks supported' },
            { label: 'EMI Options', icon: null, desc: 'No-cost & standard EMI' },
          ],
        },
        {
          title: 'Payment Solutions',
          items: [
            { label: 'Payment Gateway', icon: null, desc: 'Complete payment infrastructure' },
            { label: 'Payment Links', icon: null, desc: 'Share and collect instantly' },
            { label: 'Payment Pages', icon: null, desc: 'No-code payment pages' },
            { label: 'Subscription Billing', icon: null, desc: 'Automated recurring billing' },
            { label: 'Smart Collect', icon: null, desc: 'Virtual account collections' },
            { label: 'QR Code Payments', icon: null, desc: 'Dynamic & static QR codes' },
          ],
        },
      ],
    },
    banking: {
      title: 'Banking Solutions',
      columns: [
        {
          title: 'Banking Features',
          items: [
            { label: 'Current Account', icon: null, desc: 'Digital current account' },
            { label: 'Virtual Accounts', icon: null, desc: 'Automate reconciliation' },
            { label: 'Fast Settlements', icon: null, desc: 'Instant fund transfers' },
            { label: 'Bulk Payouts', icon: null, desc: 'Pay vendors & employees' },
            { label: 'Invoice Management', icon: null, desc: 'Create & track invoices' },
            { label: 'Expense Cards', icon: null, desc: 'Corporate credit cards' },
          ],
        },
        {
          title: 'Business Solutions',
          items: [
            { label: 'For Startups', icon: null, desc: 'Banking for early-stage' },
            { label: 'For SMBs', icon: null, desc: 'Scale your business' },
            { label: 'For Enterprises', icon: null, desc: 'Enterprise-grade banking' },
            { label: 'For Marketplaces', icon: null, desc: 'Split payments & routing' },
            { label: 'For Fintech', icon: null, desc: 'Embed banking features' },
            { label: 'For E-commerce', icon: null, desc: 'Complete commerce stack' },
          ],
        },
      ],
    },
    payroll: {
      title: 'Payroll Management',
      columns: [
        {
          title: 'Payroll Services',
          items: [
            { label: 'Salary Processing', icon: null, desc: 'Automated salary disbursement' },
            { label: 'Tax Compliance', icon: null, desc: 'TDS & statutory compliance' },
            { label: 'Expense Management', icon: null, desc: 'Track & reimburse expenses' },
            { label: 'Attendance & Leave', icon: null, desc: 'Integrated time tracking' },
            { label: 'Payroll Reports', icon: null, desc: 'Detailed analytics' },
            { label: 'Contractor Payments', icon: null, desc: 'Pay freelancers easily' },
          ],
        },
        {
          title: 'Employee Benefits',
          items: [
            { label: 'Health Insurance', icon: null, desc: 'Group medical coverage' },
            { label: 'Retirement Plans', icon: null, desc: 'PF & gratuity management' },
            { label: 'Stock Options', icon: null, desc: 'ESOP management' },
            { label: 'Wellness Programs', icon: null, desc: 'Employee wellness benefits' },
            { label: 'Loan Advances', icon: null, desc: 'Easy salary advances' },
            { label: 'Flexible Benefits', icon: null, desc: 'Customizable perks' },
          ],
        },
      ],
    },
    engage: {
      title: 'Customer Engagement',
      columns: [
        {
          title: 'Communication Tools',
          items: [
            { label: 'SMS & Email', icon: null, desc: 'Multi-channel messaging' },
            { label: 'Push Notifications', icon: null, desc: 'Real-time alerts' },
            { label: 'WhatsApp Business', icon: null, desc: 'WhatsApp integration' },
            { label: 'Customer Portal', icon: null, desc: 'Self-service dashboard' },
            { label: 'In-app Messages', icon: null, desc: 'Contextual messages' },
            { label: 'Voice Calls', icon: null, desc: 'Automated voice calls' },
          ],
        },
        {
          title: 'Engagement Solutions',
          items: [
            { label: 'Smart Invoicing', icon: null, desc: 'Automated invoice generation' },
            { label: 'Payment Reminders', icon: null, desc: 'Reduce payment delays' },
            { label: 'Customer Analytics', icon: null, desc: 'Behavior insights' },
            { label: 'Feedback Collection', icon: null, desc: 'NPS & surveys' },
            { label: 'Loyalty Programs', icon: null, desc: 'Reward your customers' },
            { label: 'Campaign Manager', icon: null, desc: 'Marketing automation' },
          ],
        },
      ],
    },
    partners: {
      title: 'Partner Programs',
      columns: [
        {
          title: 'Partner Types',
          items: [
            { label: 'Referral Program', icon: null, desc: 'Earn by referring businesses' },
            { label: 'Integration Partners', icon: null, desc: 'Build integrations' },
            { label: 'Enterprise Partners', icon: null, desc: 'Large-scale collaboration' },
            { label: 'Technology Partners', icon: null, desc: 'Tech ecosystem partners' },
            { label: 'Agency Partners', icon: null, desc: 'Marketing & development' },
            { label: 'Reseller Program', icon: null, desc: 'White-label solutions' },
          ],
        },
        {
          title: 'Partner Resources',
          items: [
            { label: 'Partner Portal', icon: null, desc: 'Manage your partnership' },
            { label: 'Documentation', icon: null, desc: 'Integration guides' },
            { label: 'Training & Certification', icon: null, desc: 'Become certified' },
            { label: 'Marketing Resources', icon: null, desc: 'Co-marketing materials' },
            { label: 'Technical Support', icon: null, desc: 'Dedicated support team' },
            { label: 'Commission Structure', icon: null, desc: 'Transparent earnings' },
          ],
        },
      ],
    },
    resources: {
      title: 'Resources & Support',
      columns: [
        {
          title: 'Developer Resources',
          items: [
            { label: 'Documentation', icon: null, desc: 'Complete API docs' },
            { label: 'API Reference', icon: null, desc: 'Detailed API endpoints' },
            { label: 'Code Samples', icon: null, desc: 'Ready-to-use examples' },
            { label: 'SDKs & Libraries', icon: null, desc: 'All major languages' },
            { label: 'Webhooks', icon: null, desc: 'Real-time event handling' },
            { label: 'Testing Tools', icon: null, desc: 'Test your integration' },
          ],
        },
        {
          title: 'Help & Support',
          items: [
            { label: 'Help Center', icon: null, desc: 'FAQs & guides' },
            { label: 'Community Forum', icon: null, desc: 'Connect with developers' },
            { label: 'Contact Support', icon: null, desc: '24/7 assistance' },
            { label: 'System Status', icon: null, desc: 'Real-time uptime monitor' },
            { label: 'Video Tutorials', icon: null, desc: 'Learn with videos' },
            { label: 'Blog & Updates', icon: null, desc: 'Latest news & features' },
          ],
        },
      ],
    },
  };

  const data = megaMenuData[menuId];

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white shadow-2xl border border-gray-200 rounded-xl min-w-[600px] max-w-3xl overflow-hidden"
    >
      <div className="px-6 sm:px-8 py-8">
        {/* Title */}
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{data.title}</h3>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {data.columns.map((column, idx) => (
            <div key={idx} className="space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                {column.title}
              </h4>
              <ul className="space-y-1">
                {column.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <a
                      href="#"
                      className="flex items-start gap-3 p-2.5 sm:p-3 rounded-lg hover:bg-blue-50 transition-all group"
                    >
                      {item.icon && (
                        <item.icon size={20} className="flex-shrink-0 text-blue-600 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm sm:text-base text-gray-800 group-hover:text-blue-600 transition-colors">
                            {item.label}
                          </span>
                          <ArrowRight
                            size={16}
                            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-600 flex-shrink-0"
                          />
                        </div>
                        {item.desc && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.desc}</p>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;
