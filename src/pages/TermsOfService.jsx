import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Scale, FileText, AlertCircle, Clock, Shield, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSettings } from '../hooks/useSettings';

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState(0);
  const { settings } = useSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const companyName = settings.websiteName || 'Our Platform';

  const sections = [
    {
      id: "acceptance",
      icon: <CheckCircle size={20} />,
      title: '1. Acceptance of Terms',
      content: `By accessing and using the ${companyName} platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: "license",
      icon: <FileText size={20} />,
      title: '2. Use License',
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on ${companyName}'s platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.`
    },
    {
      id: "disclaimer",
      icon: <AlertCircle size={20} />,
      title: '3. Disclaimer',
      content: `The materials on ${companyName}'s platform are provided on an "as is" basis. ${companyName} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including fitness for a particular purpose.`
    },
    {
      id: "limitations",
      icon: <Shield size={20} />,
      title: '4. Limitations of Liability',
      content: `In no event shall ${companyName} or its suppliers be liable for any damages arising out of the use or inability to use the materials on ${companyName}'s platform.`
    },
    {
      id: "accuracy",
      icon: <FileText size={20} />,
      title: '5. Accuracy of Materials',
      content: `The materials appearing on ${companyName}'s platform could include technical, typographical, or photographic errors. ${companyName} may make changes to the materials at any time without notice.`
    },
    {
      id: "content",
      icon: <Shield size={20} />,
      title: '6. Materials and Content',
      content: `The materials on ${companyName}'s platform are protected by existing copyright laws. Unauthorized use of the materials may result in infringement of copyright and trademark rights.`
    },
    {
      id: "responsibilities",
      icon: <CheckCircle size={20} />,
      title: '7. User Responsibilities',
      content: 'Users are solely responsible for maintaining the confidentiality of their account information and passwords. You are solely responsible for all activities that occur under your account.'
    },
    {
      id: "payment",
      icon: <Scale size={20} />,
      title: '8. Payment Processing',
      content: 'By using our payment services, you authorize us to collect and process payments on your behalf. We comply with all applicable payment industry standards including PCI-DSS compliance.'
    },
    {
      id: "modifications",
      icon: <Clock size={20} />,
      title: '9. Modifications to Terms',
      content: `${companyName} may revise these terms of service at any time without notice. Your continued use of the platform constitutes acceptance of the revised terms.`
    },
    {
      id: "law",
      icon: <Scale size={20} />,
      title: '10. Governing Law',
      content: 'These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Bangalore, India.'
    },
    {
      id: "contact",
      icon: <Mail size={20} />,
      title: '11. Contact Information',
      content: 'If you have any questions about these Terms of Service, please contact us using the information below.'
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
              <Scale className="text-blue-600 w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Legal Agreement</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              Terms of <span className="text-blue-600">Service</span>
            </h1>
            <div className="flex flex-col md:flex-row items-center gap-6 text-slate-500 font-medium">
              <p className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg text-sm">
                <FileText size={16} /> Version 1.2.0
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

                {/* Specific Contact Layout for Section 11 */}
                {section.id === "contact" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                      <Mail className="text-blue-600 mb-3" size={24} />
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Email Us</p>
                      <p className="text-sm font-black text-slate-800">{settings.websiteEmail}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                      <Phone className="text-blue-600 mb-3" size={24} />
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Call Support</p>
                      <p className="text-sm font-black text-slate-800">{settings.websitePhone}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
                      <MapPin className="text-blue-600 mb-3" size={24} />
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
                  <Scale size={40} className="text-blue-400" />
                </div>
                <h3 className="text-3xl font-black mb-4">Fair & Transparent Terms.</h3>
                <p className="text-blue-100/80 text-lg font-medium leading-relaxed">
                  We believe in clear, honest agreements. Our terms are designed to protect both you and us. If you have any concerns, our legal team is ready to help.
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

export default TermsOfService;
