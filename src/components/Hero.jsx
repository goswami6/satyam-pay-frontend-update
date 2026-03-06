import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden pt-28 md:pt-36 pb-16 md:pb-32 px-4">
      {/* Decorative background blurs */}
      <div className="absolute top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full blur-[100px] opacity-30"></div>
      <div className="absolute bottom-10 -left-20 w-64 h-64 bg-purple-200 rounded-full blur-[100px] opacity-30"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center lg:text-left space-y-6 md:space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-xs md:text-sm font-semibold text-blue-700 uppercase tracking-wider">
              Trusted by 5M+ businesses
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">fintech platform</span> for growth
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
              Accept payments, manage finances, and delight customers with our comprehensive platform designed for modern Indian businesses.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={itemVariants} 
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group">
              Get Started 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
              <Play size={18} fill="currentColor" /> Login
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-slate-200/60"
          >
            <div className="text-center lg:text-left">
              <p className="text-2xl md:text-3xl font-black text-slate-900">₹500K+</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Trans.</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-2xl md:text-3xl font-black text-slate-900">100+</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Countries</p>
            </div>
            <div className="text-center lg:text-left col-span-2 md:col-span-1">
              <p className="text-2xl md:text-3xl font-black text-slate-900">99.9%</p>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Uptime SLA</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual - Now responsive */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mt-12 lg:mt-0 flex justify-center items-center"
        >
          {/* Main Background Blob */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-full opacity-10 blur-[80px] scale-110"></div>

          {/* The Dashboard Card Container */}
          <div className="relative w-full max-w-[500px] aspect-square lg:aspect-auto lg:h-[500px]">
            
            {/* Card 1 - Main Dashboard (Visible on all screens) */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 lg:right-4 w-[85%] md:w-[350px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 md:p-6 z-20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="h-3 bg-slate-100 rounded-full w-3/4"></div>
                <div className="h-3 bg-slate-100 rounded-full w-1/2"></div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-16 bg-blue-50 rounded-2xl border border-blue-100"></div>
                  <div className="h-16 bg-purple-50 rounded-2xl border border-purple-100"></div>
                </div>
                <div className="h-24 bg-slate-50 rounded-2xl border border-slate-100"></div>
              </div>
            </motion.div>

            {/* Card 2 - Revenue (Floating) */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 left-0 lg:left-8 w-[70%] md:w-[280px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 md:p-6 z-30"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <span className="text-xl font-bold">₹</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Live Revenue</p>
                  <p className="text-xl font-black text-slate-900">₹45,234.00</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div className="bg-blue-600 h-2 rounded-full w-2/3 shadow-sm"></div>
              </div>
              <p className="text-[10px] font-bold text-emerald-500">+12.5% from yesterday</p>
            </motion.div>

            {/* Circular Decorative Element */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[20px] border-blue-100/30 rounded-full -z-10"
            ></motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;