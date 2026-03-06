import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import Testimonials from '../components/Testimonials';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSettings } from '../hooks/useSettings';
import {
  CreditCard, Wallet, Send, Landmark, Repeat, Users,
  Shield, Zap, Code, Cloud, Clock, Award, ChevronRight, ChevronDown
} from 'lucide-react';

const Home = () => {
  const { settings } = useSettings();
  const sections = [
    {
      title: 'Payment Solutions',
      description: 'Accept cards, wallets, UPI, and more through a single integration',
      icon: CreditCard,
      items: ['Cards', 'Wallets', 'UPI', 'Net Banking', 'Subscriptions'],
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Banking Solutions',
      description: 'Manage your business finances with current accounts, virtual accounts, settlements and payouts',
      icon: Landmark,
      items: ['Current Account', 'Virtual Accounts', 'Settlements', 'Payouts'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Payroll Management',
      description: 'Handle employee payroll and compliance with ease',
      icon: Users,
      items: ['Salary Management', 'Compliance', 'Tax Filing', 'Reports'],
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const stats = [
    { label: 'Transactions', value: '₹50,000Cr+', icon: Zap },
    { label: 'Active Merchants', value: '10,000+', icon: Users },
    { label: 'Uptime SLA', value: '99.9%', icon: Clock },
    { label: 'Security', value: 'PCI-DSS', icon: Shield },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      {/* Navbar */}
      <Navbar isLoggedIn={false} />

      {/* Hero Section */}
      <Hero />

      {/* Stats Strip - Mobile Responsive */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-sm">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Showcase */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-2 sm:space-y-3 lg:space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 px-4">
              Welcome to {settings.websiteName}
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Everything your business needs to manage payments, finances, and delight customers
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 hover:shadow-xl transition-all duration-300"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity`}></div>

                <div className="relative">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${section.color} rounded-lg sm:rounded-xl mb-3 sm:mb-4 flex items-center justify-center text-white shadow-lg`}>
                    <section.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                    {section.description}
                  </p>

                  <ul className="space-y-1.5 sm:space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r ${section.color} rounded-full flex-shrink-0`}></div>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>

                
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* API Integration Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left - Code */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">
                Developer Friendly
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-6 sm:mb-8">
                Simple and powerful APIs to integrate {settings.websiteName} in minutes
              </p>

              <div className="bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl p-4 sm:p-6 font-mono text-xs sm:text-sm overflow-x-auto">
                <pre className="text-green-400 whitespace-pre-wrap break-words">{`// Initialize ${settings.websiteName}
const options = {
  key: "YOUR_KEY_ID",
  amount: 50000,
  currency: "INR",
  name: "${settings.websiteName}"
};

const payment = new PaymentGateway(options);
payment.open();`}</pre>
              </div>

              {/* Mobile View Developer Features */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:hidden">
                <div className="bg-white/5 rounded-lg p-3">
                  <Code size={16} className="text-blue-400 mb-1" />
                  <div className="font-medium text-sm">REST APIs</div>
                  <div className="text-xs text-gray-400">Well-documented</div>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <Cloud size={16} className="text-blue-400 mb-1" />
                  <div className="font-medium text-sm">SDKs</div>
                  <div className="text-xs text-gray-400">6+ languages</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Features (Desktop) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <div className="hidden sm:block space-y-4 lg:space-y-6">
                {[
                  { title: 'REST APIs', desc: 'Simple and well-documented REST endpoints', icon: Code },
                  { title: 'SDKs', desc: 'Official SDKs for Node, PHP, Python, Java, Ruby', icon: Cloud },
                  { title: 'Webhooks', desc: 'Real-time event notifications for your app', icon: Zap },
                  { title: '24/7 Support', desc: 'Dedicated developer support team', icon: Award },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 lg:gap-4 items-start">
                    <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg">
                      <item.icon size={18} className="lg:w-5 lg:h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm lg:text-base mb-0.5 lg:mb-1">{item.title}</h4>
                      <p className="text-xs lg:text-sm text-gray-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="sm:hidden mt-6">
                <Link
                  to="/api-documentation"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View API Documentation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 space-y-2 sm:space-y-3"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Find answers to common questions about our payment gateway
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-3 sm:space-y-4"
          >
            {[
              {
                q: 'How long does integration take?',
                a: 'Our REST API can be integrated in minutes. Complete integration typically takes 1-2 hours.',
              },
              {
                q: 'What payment methods are supported?',
                a: 'We support cards, wallets, UPI, net banking, and many more payment methods across India.',
              },
              {
                q: 'Is my data secure?',
                a: 'Yes, we are PCI-DSS compliant and use bank-grade encryption for all transactions.',
              },
              {
                q: 'What is your uptime SLA?',
                a: 'We maintain 99.9% uptime SLA with 24/7 monitoring and support.',
              },
            ].map((faq, idx) => (
              <motion.details
                key={idx}
                variants={itemVariants}
                className="group bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-lg transition-all cursor-pointer"
              >
                <summary className="flex items-center justify-between p-4 sm:p-6 font-medium text-sm sm:text-base text-gray-900 list-none">
                  <span className="pr-4">{faq.q}</span>
                  <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-full flex items-center justify-center group-open:rotate-180 transition-transform">
                    <ChevronDown size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                  </span>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-3 sm:pt-4">
                  {faq.a}
                </div>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4">
              Start Growing Your Business Today
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using {settings.websiteName} to accept payments and manage finances
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto bg-white text-blue-600 font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto border-2 border-white text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Login to Dashboard
            </Link>
          </motion.div>

          {/* Trust Badges - Mobile */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-blue-100">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="sm:w-4 sm:h-4" />
              PCI-DSS Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={14} className="sm:w-4 sm:h-4" />
              99.9% Uptime
            </span>
            <span className="flex items-center gap-1.5">
              <Award size={14} className="sm:w-4 sm:h-4" />
              Trusted by 10k+ Merchants
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;