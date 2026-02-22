import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Slider from './Slider';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Amit Sharma',
      role: 'Founder, TechStartup Co',
      company: 'TechStartup Co',
      image: '👨‍💼',
      rating: 5,
      text: 'Razorpay has transformed how we handle payments. The integration was seamless and our conversion rates improved by 30%.',
    },
    {
      id: 2,
      name: 'Priya Verma',
      role: 'CEO, Fashion Retail',
      company: 'Fashion Retail Inc',
      image: '👩‍💼',
      rating: 5,
      text: 'Best payment platform in India. Customer support is exceptional and the dashboard is intuitive. Highly recommended!',
    },
    {
      id: 3,
      name: 'Rohit Malhotra',
      role: 'Director, E-commerce Group',
      company: 'E-commerce Group',
      image: '👨‍💻',
      rating: 5,
      text: 'The reliability and features offered by Razorpay are unmatched. We process thousands of transactions daily without any issues.',
    },
    {
      id: 4,
      name: 'Ananya Rao',
      role: 'Founder, SaaS Platform',
      company: 'SaaS Platform',
      image: '👩‍💻',
      rating: 5,
      text: 'Switched to Razorpay and never looked back. The ROI, features, and support are top-notch. Worth every penny!',
    },
  ];

  const renderTestimonial = (testimonial) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array(testimonial.rating)
          .fill(0)
          .map((_, i) => (
            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
      </div>

      {/* Quote */}
      <p className="text-lg text-gray-700 mb-6 leading-relaxed italic">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 border-t border-gray-200 pt-6">
        <div className="text-4xl">{testimonial.image}</div>
        <div>
          <p className="font-bold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
          <p className="text-xs text-blue-600 font-medium">{testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="section bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Customer Success</span>
          </div>
          <h2 className="heading">Trusted by Industry Leaders</h2>
          <p className="subheading max-w-2xl mx-auto">
            Hear from businesses across India who are growing with Razorpay
          </p>
        </motion.div>

        {/* Testimonials Slider */}
        <div className="mb-16">
          <Slider
            items={testimonials}
            renderItem={renderTestimonial}
            autoPlay={true}
            autoPlayInterval={6000}
          />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">5M+</p>
            <p className="text-blue-100">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">₹500K+</p>
            <p className="text-blue-100">Daily Transactions</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold mb-2">99.9%</p>
            <p className="text-blue-100">Uptime SLA</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
