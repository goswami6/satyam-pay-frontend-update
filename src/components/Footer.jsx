import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ExternalLink, ScrollText, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Payment Gateway', href: '#' },
        { label: 'Banking', href: '#' },
        { label: 'Payroll', href: '#' },
        { label: 'Engage', href: '#' },
        { label: 'Pricing', href: '#' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Code Samples', href: '#' },
        { label: 'SDKs', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Compliance', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-100">
      {/* CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-gray-800 bg-gradient-to-r from-blue-600/10 to-purple-600/10 py-12 px-4 md:px-8"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-3">Ready to grow your business?</h3>
            <p className="text-gray-400">Start accepting payments today with Razorpay</p>
          </div>
          <div className="flex gap-4 md:justify-end">
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Schedule Demo</button>
          </div>
        </div>
      </motion.div>

      {/* Main Footer */}
      <div className="border-t border-gray-800 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Logo & Description */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 font-bold text-2xl text-blue-400 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  RZ
                </div>
                Razorpay
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                The fintech platform that empowers businesses to grow. Accept payments, manage finances, and delight customers.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-400" />
                  <a href="mailto:support@razorpay.com" className="hover:text-white transition-colors">
                    support@razorpay.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-blue-400" />
                  <a href="tel:+919876543210" className="hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-blue-400" />
                  <span>Mumbai, India</span>
                </div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <h4 className="font-bold mb-2">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">Get the latest updates on payments and fintech trends</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-lg font-medium">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>

          {/* Footer Links Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-gray-800"
          >
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h4 className="font-bold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                      >
                        {link.label}
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500">
              © {currentYear} Razorpay. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Github, label: 'GitHub', href: '#' },
                { icon: Linkedin, label: 'LinkedIn', href: '#' },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors flex items-center justify-center"
                  title={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>

            {/* Compliance */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ScrollText size={16} />
              <span>PCI-DSS Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
