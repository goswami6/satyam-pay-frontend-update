import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Globe,
  Lock,
  BarChart3,
} from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Multiple Payment Methods',
      description: 'Accept cards, wallets, UPI, and more with a single integration',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Track every transaction with comprehensive reporting and insights',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'PCI-DSS compliant with fraud detection and dispute management',
    },
    {
      icon: Zap,
      title: 'Smart Routing',
      description: 'Automatic payment route optimization for better success rates',
    },
    {
      icon: Users,
      title: 'Customer Management',
      description: 'Built-in tools for customer engagement and retention',
    },
    {
      icon: Globe,
      title: 'Global Support',
      description: 'Available in 100+ countries with local payment methods',
    },
    {
      icon: Lock,
      title: 'Data Protection',
      description: 'Banking-grade encryption for all your transaction data',
    },
    {
      icon: BarChart3,
      title: 'Advanced Reporting',
      description: 'Custom dashboards and automated reports for business intelligence',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="section bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="heading">Powerful Features for Every Business</h2>
          <p className="subheading max-w-2xl mx-auto">
            Everything you need to grow your business and delight your customers
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="card group cursor-pointer"
            >
              {/* Icon Container */}
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 group-hover:bg-blue-600 transition-colors">
                <feature.icon size={24} className="text-blue-600 group-hover:text-white transition-colors" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

              {/* Hover indicator */}
              <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                Learn more →
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;


