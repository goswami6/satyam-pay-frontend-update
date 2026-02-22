import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

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

  const floatingVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.5 },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden pt-20 md:pt-32 pb-20 md:pb-32 px-4 md:px-8">
      {/* Decorative shapes */}
      <div className="absolute top-40 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full"
          >
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-sm font-medium text-blue-600">Trusted by 5M+ businesses</span>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              The <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">fintech platform</span> for modern business
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg">
              Accept payments, manage finances, and grow your business with our comprehensive platform designed for Indian businesses.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <button className="btn-primary inline-flex items-center justify-center gap-2 text-base">
              Get Started <ArrowRight size={20} />
            </button>
            <button className="btn-secondary inline-flex items-center justify-center gap-2 text-base">
              <Play size={20} /> Watch Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">₹500K+</p>
              <p className="text-sm text-gray-600">Transactions Daily</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">100+</p>
              <p className="text-sm text-gray-600">Countries Supported</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">99.9%</p>
              <p className="text-sm text-gray-600">Uptime SLA</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={floatingVariants}
          className="relative h-96 md:h-full min-h-96"
        >
          {/* Background shapes */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
            className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl opacity-20 blur-2xl"
          ></motion.div>

          {/* Card 1 - Dashboard Preview */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
            className="absolute top-0 right-20 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Dashboard</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-gray-200 rounded-full w-2/3"></div>
              <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
              <div className="grid grid-cols-2 gap-2 pt-4">
                <div className="h-12 bg-blue-100 rounded-lg"></div>
                <div className="h-12 bg-purple-100 rounded-lg"></div>
              </div>
            </div>
          </motion.div>

          {/* Card 2 - Payment Processing */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
            className="absolute bottom-0 left-10 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                ₹
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="font-bold text-gray-900">₹45,234</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Today</span>
                <span className="font-semibold text-gray-900">₹12,840</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
              </div>
            </div>
          </motion.div>

          {/* Floating Icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 blur-xl"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
