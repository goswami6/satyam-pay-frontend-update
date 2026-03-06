import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ShieldCheck, Lock, Eye, FileText, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSettings } from '../hooks/useSettings';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState(0);
  const { settings } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const companyName = settings.websiteName || 'Our Platform';

  const sections = [
    {
      id: "intro",
      icon: <FileText size={20} />,
      title: '1. Introduction',
      content: `${companyName} ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our payment processing services.`
    },
    {
      id: "collect",
      icon: <Eye size={20} />,
      title: '2. Information We Collect',
      content: 'We collect information you provide directly to us, such as when you create an account, make a payment, or contact us for support. This includes your name, email address, phone number, billing address, payment information, and business details. We also automatically collect certain information about your device and browsing activity, including IP address, browser type, and pages visited.'
    },
    {
      id: "usage",
      icon: <ShieldCheck size={20} />,
      title: '3. How We Use Your Information',
      content: 'We use the information we collect to provide, maintain, and improve our services; process payments; send transactional and promotional communications; comply with legal obligations; prevent fraud; and understand how users interact with our platform. We never sell your personal information to third parties.'
    },
    {
      id: "security",
      icon: <Lock size={20} />,
      title: '4. Data Security',
      content: `${companyName} employs industry-standard security measures to protect your information, including encryption, firewalls, and secure servers. We comply with PCI-DSS standards for payment card data security. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      id: "cookies",
      icon: <FileText size={20} />,
      title: '5. Cookies & Tracking',
      content: 'We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your preferences, understand user behavior, and provide personalized content. You can control cookie settings through your browser preferences.'
    },
    {
      id: "sharing",
      icon: <ChevronRight size={20} />,
      title: '6. Third-Party Sharing',
      content: 'We may share your information with trusted third-party service providers who assist us in operating our website and conducting our business, such as payment processors, analytics providers, and customer support platforms. These partners are bound by confidentiality agreements.'
    },
    {
      id: "rights",
      icon: <ShieldCheck size={20} />,
      title: '8. User Rights',
      content: `You have the right to access, correct, or delete your personal information. You can update your account information at any time through your user dashboard. To request deletion of your data, please contact us at ${settings.websiteEmail}.`
    },
    {
      id: "contact",
      icon: <Mail size={20} />,
      title: '13. Contact Us',
      content: 'If you have questions, concerns, or requests regarding this Privacy Policy, please reach out via the channels below.'
    }
  ];

  return (
    <div className="bg-[#FAFBFF] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-700">
      <Navbar isLoggedIn={false} />

      {/* Hero Header Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-[-5%] w-[30%] h-[30%] bg-purple-100/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 shadow-sm">
              <ShieldCheck className="text-blue-600 w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Security First Platform</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              Privacy <span className="text-blue-600">Policy</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-6 text-slate-500 font-medium">
              <p className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                <FileText size={16} /> Version 2.4.0
              </p>
              <p className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                Last updated: March 2026
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Hub */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Sidebar Navigation (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">Table of Contents</p>
              {sections.map((section, idx) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(idx);
                    document.getElementById(section.id).scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === idx
                    ? 'bg-white text-blue-600 shadow-md shadow-blue-100/50 translate-x-2'
                    : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                  <span className={activeSection === idx ? 'text-blue-600' : 'text-slate-300'}>
                    {section.icon}
                  </span>
                  {section.title.split('. ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-9 space-y-12">
            {sections.map((section, idx) => (
              <motion.section
                id={section.id}
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                onViewportEnter={() => setActiveSection(idx)}
                viewport={{ once: true, margin: '-20%' }}
                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl flex items-center justify-center transition-colors duration-300 text-blue-600 shadow-inner">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800">{section.title}</h2>
                </div>

                <p className="text-slate-600 text-lg leading-[1.8] font-medium opacity-90">
                  {section.content}
                </p>

                {/* Specific Contact Layout for Section 13 */}
                {section.id === "contact" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <Mail className="text-blue-600 mb-3" />
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email Us</p>
                      <p className="text-sm font-black text-slate-800">{settings.websiteEmail}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <Phone className="text-blue-600 mb-3" />
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Call Support</p>
                      <p className="text-sm font-black text-slate-800">{settings.websitePhone}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <MapPin className="text-blue-600 mb-3" />
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Office</p>
                      <p className="text-sm font-black text-slate-800">{settings.city}, {settings.state}</p>
                    </div>
                  </div>
                )}
              </motion.section>
            ))}

            {/* Bottom Insight Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[3rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
              <div className="relative z-10 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                  <ShieldCheck size={40} className="text-blue-400" />
                </div>
                <h3 className="text-3xl font-black mb-4">Your Privacy is Non-Negotiable.</h3>
                <p className="text-blue-100/80 text-lg font-medium leading-relaxed">
                  We built {companyName} on the foundation of trust. If you have any concerns about how your data is handled, our legal team is ready to assist you 24/7.
                </p>
                <button className="mt-10 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-50 transition-colors">
                  Contact Legal Team
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-10 right-10 w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 z-50 transition-all"
        >
          <ArrowUp size={24} strokeWidth={3} />
        </motion.button>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;