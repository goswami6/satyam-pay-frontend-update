import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses',
      monthlyPrice: 0,
      annualPrice: 0,
      period: 'per month',
      features: [
        { text: 'Payments', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Email Support', included: true },
        { text: 'Multi-currency', included: false },
        { text: 'Advanced Reports', included: false },
        { text: 'API Access', included: false },
      ],
      highlight: false,
      cta: 'Get Started',
    },
    {
      name: 'Professional',
      description: 'For growing businesses',
      monthlyPrice: 999,
      annualPrice: 9990,
      period: 'per month',
      features: [
        { text: 'Payments', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Email Support', included: true },
        { text: 'Multi-currency', included: true },
        { text: 'Advanced Reports', included: true },
        { text: 'API Access', included: false },
      ],
      highlight: true,
      cta: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      description: 'For large enterprises',
      monthlyPrice: 4999,
      annualPrice: 49990,
      period: 'per month',
      features: [
        { text: 'Payments', included: true },
        { text: 'Basic Analytics', included: true },
        { text: 'Email Support', included: true },
        { text: 'Multi-currency', included: true },
        { text: 'Advanced Reports', included: true },
        { text: 'API Access', included: true },
      ],
      highlight: false,
      cta: 'Contact Sales',
    },
  ];

  const faqs = [
    {
      q: 'Can I change plans anytime?',
      a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.',
    },
    {
      q: 'Is there a setup fee?',
      a: 'No, there are no setup fees or hidden charges. You only pay the subscription amount.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, debit cards, and bank transfers for subscription payments.',
    },
    {
      q: 'Do you offer discounts for annual billing?',
      a: 'Yes, annual billing gives you 2 months free compared to monthly billing.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="bg-white pt-32 pb-20">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="section text-center max-w-4xl mx-auto space-y-6"
      >
        <h1 className="heading">Simple, Transparent Pricing</h1>
        <p className="subheading">Choose the perfect plan for your business needs</p>

        {/* Billing Toggle */}
        <div className="inline-flex gap-4 bg-gray-100 p-1 rounded-lg mt-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
              billingCycle === 'annual'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Annual
            {billingCycle === 'annual' && (
              <span className="absolute -top-2 -right-8 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            )}
          </button>
        </div>
      </motion.section>

      {/* Pricing Cards */}
      <section className="section max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
              className={`rounded-2xl p-8 border-2 transition-all ${
                plan.highlight
                  ? 'border-blue-600 bg-gradient-to-b from-blue-50 to-white shadow-xl'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Badge */}
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-6 pt-4">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                {plan.monthlyPrice === 0 && (
                  <p className="text-green-600 font-semibold mt-2">Forever Free</p>
                )}
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg font-bold mb-8 transition-all ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="space-y-4 border-t border-gray-200 pt-8">
                {plan.features.map((feature, featureIdx) => (
                  <div key={featureIdx} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check size={20} className="text-green-600 flex-shrink-0" />
                    ) : (
                      <X size={20} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Comparison Table */}
      <section className="section bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="heading">Detailed Comparison</h2>
            <p className="subheading mt-4">Everything included in each plan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left font-bold text-gray-900">Features</th>
                  <th className="px-6 py-4 text-center font-bold text-gray-900">Starter</th>
                  <th className="px-6 py-4 text-center font-bold text-blue-600 bg-blue-50">
                    Professional
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Payment Methods', data: ['All', 'All', 'All'] },
                  { name: 'Transaction Limit', data: ['Unlimited', 'Unlimited', 'Unlimited'] },
                  { name: 'Settlements', data: ['Daily', 'Daily', 'Instant'] },
                  { name: 'Support', data: ['Email', 'Email + Phone', 'Dedicated'] },
                  { name: 'Advanced Analytics', data: ['No', 'Yes', 'Yes'] },
                  { name: 'Custom Reporting', data: ['No', 'Yes', 'Yes'] },
                  { name: 'API Rate Limit', data: ['1K/min', '10K/min', 'Unlimited'] },
                  { name: 'Webhook Support', data: ['Yes', 'Yes', 'Yes'] },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                    {row.data.map((item, dataIdx) => (
                      <td
                        key={dataIdx}
                        className={`px-6 py-4 text-center ${
                          dataIdx === 1 ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className="text-gray-700">{item}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <h2 className="heading">Pricing FAQs</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-4"
        >
          {faqs.map((faq, idx) => (
            <motion.details
              key={idx}
              variants={itemVariants}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <summary className="font-bold text-gray-900 flex items-center justify-between cursor-pointer">
                {faq.q}
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </summary>
              <p className="text-gray-600 mt-4">{faq.a}</p>
            </motion.details>
          ))}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="section bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center max-w-4xl mx-auto rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="heading text-white">Ready to get started?</h2>
          <p className="text-blue-100">Choose a plan and start accepting payments today</p>
          <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
            Get Started Free
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Pricing;
