import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  FileText,
  AlertCircle,
  CheckCircle2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { settingsAPI, enquiryAPI, getImageUrl } from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Settings state
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await settingsAPI.getPublic();
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError('');

    try {
      const res = await enquiryAPI.submit(formData);
      if (res.data.success) {
        setSubmitSuccess(true);
        setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
        setErrors({});

        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Touch</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12"
          >
            {/* Left Section - Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
              {/* Company Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  {settings?.logo ? (
                    <img
                      src={getImageUrl(settings.logo)}
                      alt={settings?.websiteName || 'Logo'}
                      className="w-12 h-12 rounded-xl object-contain shadow-md"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {settings?.websiteName?.charAt(0) || 'RP'}
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-gray-900">{settings?.websiteName || 'Rabbit Pay'}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {settings?.websiteDescription || "India's leading fintech platform powering payments and banking for 5M+ businesses. We're here to help you grow and scale your business with our cutting-edge solutions."}
                </p>

                {/* Contact Information */}
                <div className="space-y-4">
                  {/* Phone */}
                  <a
                    href={`tel:${settings?.websitePhone?.replace(/\s/g, '') || '+918449968867'}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                      <Phone size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                        {settings?.websitePhone || '+91 8449968867'}
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${settings?.websiteEmail || 'info@rabbitpay.in.net'}`}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all group"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                      <Mail size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900 font-medium group-hover:text-purple-600 transition-colors break-all">
                        {settings?.websiteEmail || 'info@rabbitpay.in.net'}
                      </p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <MapPin size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Office</p>
                      <p className="text-gray-700 leading-relaxed">
                        {settings?.address || 'Shop No. 21, City Center Mall, Hooda Complex'},<br />
                        {settings?.city || 'Rohtak'}, {settings?.state || 'Haryana'}<br />
                        {settings?.zipCode || '124001'}, {settings?.country || 'India'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.6158481233835!2d77.60770731482169!3d12.932664990883735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15a50e8d7f07%3A0x5b5a2b3b5b5a2b3b!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  ></iframe>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-3 flex-wrap">
                  {[
                    { icon: Facebook, color: 'hover:bg-blue-600', label: 'Facebook', link: settings?.socialLinks?.facebook },
                    { icon: Twitter, color: 'hover:bg-sky-500', label: 'Twitter', link: settings?.socialLinks?.twitter },
                    { icon: Linkedin, color: 'hover:bg-blue-700', label: 'LinkedIn', link: settings?.socialLinks?.linkedin },
                    { icon: Instagram, color: 'hover:bg-pink-600', label: 'Instagram', link: settings?.socialLinks?.instagram },
                  ].filter(social => social.link).map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:text-white ${social.color} transition-all hover:scale-110 hover:shadow-lg`}
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                  {/* Fallback if no social links */}
                  {!settings?.socialLinks?.facebook && !settings?.socialLinks?.twitter &&
                    !settings?.socialLinks?.linkedin && !settings?.socialLinks?.instagram && (
                      <p className="text-gray-500 text-sm">Social links coming soon!</p>
                    )}
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Business Hours</h3>
                <div className="space-y-2 text-blue-50">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-400">
                  <p className="text-sm text-blue-100">
                    24/7 Support available for critical issues
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Contact Form */}
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-200">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
                </div>

                {/* Success Message */}
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Message sent successfully!</p>
                      <p className="text-sm text-green-700">We'll get back to you within 24 hours.</p>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Failed to send message</p>
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3.5 border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600 text-sm">
                        <AlertCircle size={14} />
                        <span>{errors.fullName}</span>
                      </div>
                    )}
                  </div>

                  {/* Email and Phone Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400`}
                          placeholder="john@company.com"
                        />
                      </div>
                      {errors.email && (
                        <div className="flex items-center gap-1.5 mt-2 text-red-600 text-sm">
                          <AlertCircle size={14} />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3.5 border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400`}
                          placeholder="9876543210"
                          maxLength="10"
                        />
                      </div>
                      {errors.phone && (
                        <div className="flex items-center gap-1.5 mt-2 text-red-600 text-sm">
                          <AlertCircle size={14} />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full pl-12 pr-4 py-3.5 border ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400`}
                        placeholder="How can we help you?"
                      />
                    </div>
                    {errors.subject && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600 text-sm">
                        <AlertCircle size={14} />
                        <span>{errors.subject}</span>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 text-gray-400" size={20} />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="6"
                        className={`w-full pl-12 pr-4 py-3.5 border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          } rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400`}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    {errors.message && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600 text-sm">
                        <AlertCircle size={14} />
                        <span>{errors.message}</span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Minimum 20 characters required
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={20} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Privacy Note */}
                  <p className="text-xs text-gray-500 text-center pt-2">
                    🔒 We respect your privacy. Your information is secure and will never be shared with third parties.
                  </p>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Quick Links Section */}
      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Need Quick Help?</h2>
            <p className="text-gray-600">Check out our frequently asked questions or documentation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Documentation',
                desc: 'Complete guides and API references',
                link: '#',
                icon: '📚',
              },
              {
                title: 'Help Center',
                desc: 'FAQs and troubleshooting guides',
                link: '#',
                icon: '❓',
              },
              {
                title: 'System Status',
                desc: 'Check real-time system status',
                link: '#',
                icon: '🟢',
              },
            ].map((item, idx) => (
              <motion.a
                key={idx}
                href={item.link}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-transparent hover:border-blue-200 hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-3">{item.desc}</p>
                <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                  Learn More <Send size={16} />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
