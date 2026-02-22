import React from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const sections = [
    {
      title: 'Payment Solutions',
      description: 'Accept all payment methods with our unified payment gateway',
      items: ['Cards', 'Wallets', 'UPI', 'Recurring', 'Subscriptions'],
    },
    {
      title: 'Banking Solutions',
      description: 'Manage your business finances with our banking platform',
      items: ['Current Account', 'Virtual Accounts', 'Settlements', 'Payouts'],
    },
    {
      title: 'Payroll Management',
      description: 'Handle employee payroll and compliance with ease',
      items: ['Salary Management', 'Compliance', 'Tax Filing', 'Reports'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Product Showcase */}
      <section className="section bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="heading">Complete Fintech Platform</h2>
            <p className="subheading max-w-2xl mx-auto">
              Everything your business needs to manage payments, finances, and scale globally
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="card border-2 border-transparent hover:border-blue-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <FeatureSection />

      {/* API Integration Section */}
      <section className="section bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Code */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="heading text-white mb-6">Developer Friendly</h2>
              <p className="subheading text-gray-300 mb-8">
                Simple and powerful APIs to integrate Razorpay in minutes
              </p>

              <div className="bg-gray-700 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-green-400">{`// Initialize Razorpay
const options = {
  key: "YOUR_KEY_ID",
  amount: 50000,
  currency: "INR",
  name: "Razorpay"
};

const razorpay = new Razorpay(options);
razorpay.open();`}</pre>
              </div>
            </motion.div>

            {/* Right - Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {[
                { title: 'REST APIs', desc: 'Simple and well-documented REST endpoints' },
                { title: 'SDKs', desc: 'Official SDKs for Node, PHP, Python, Java, Ruby' },
                { title: 'Webhooks', desc: 'Real-time event notifications for your app' },
                { title: '24/7 Support', desc: 'Dedicated developer support team' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-1 bg-gradient-to-b from-blue-400 to-purple-600 rounded-full"></div>
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 space-y-4"
          >
            <h2 className="heading">Frequently Asked Questions</h2>
            <p className="subheading">Find answers to common questions about our platform</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-4"
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
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <summary className="font-bold text-gray-900 flex items-center justify-between cursor-pointer">
                  {faq.q}
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">→</span>
                </summary>
                <p className="text-gray-600 mt-4">{faq.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading text-white mb-4">Start Growing Your Business Today</h2>
            <p className="text-blue-100 text-lg">
              Join 5M+ businesses using Razorpay to accept payments and manage finances
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
              Get Started Free
            </button>
            <button className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Schedule a Demo
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
