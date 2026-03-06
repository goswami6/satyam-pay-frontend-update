import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSettings } from '../hooks/useSettings';
import {
  Users, Target, Globe, Award, TrendingUp, Shield,
  Heart, Rocket, Coffee, Zap, Clock, Star,
  MapPin, Mail, Phone, Linkedin, Twitter, Github,
  ChevronRight, Quote
} from 'lucide-react';

const Company = () => {
  const { settings } = useSettings();
  const companyName = settings.websiteName || 'Satyam Pay';

  const stats = [
    { label: 'Transactions Processed', value: '₹50,000Cr+', icon: TrendingUp },
    { label: 'Active Merchants', value: '10,000+', icon: Users },
    { label: 'Team Members', value: '150+', icon: Heart },
    { label: 'Years of Excellence', value: '5+', icon: Award },
  ];

  const values = [
    {
      title: 'Customer First',
      description: 'Every decision we make starts with our customers. We build trust through transparency and reliability.',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Innovation',
      description: 'We constantly push boundaries to create simple, elegant solutions for complex payment challenges.',
      icon: Rocket,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      title: 'Security First',
      description: 'Protecting our customers\' data is non-negotiable. We maintain the highest security standards.',
      icon: Shield,
      color: 'from-purple-500 to-violet-500',
    },
    {
      title: 'Growth Mindset',
      description: 'We learn, adapt, and grow together. Every challenge is an opportunity to improve.',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const team = [
    {
      name: 'Satyam Singh',
      role: 'Founder & CEO',
      bio: 'Former Paytm executive with 12+ years in fintech. Passionate about democratizing digital payments.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Priya Sharma',
      role: 'Chief Technology Officer',
      bio: 'Ex-Google engineer leading our tech innovation. Built scalable systems handling millions of transactions.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      social: { linkedin: '#', github: '#' }
    },
    {
      name: 'Amit Kumar',
      role: 'Head of Product',
      bio: 'Product leader focused on creating intuitive payment experiences that businesses love to use.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Neha Gupta',
      role: 'Chief Revenue Officer',
      bio: 'Driving growth and partnerships. Previously led sales at Razorpay for 5 years.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      social: { linkedin: '#', twitter: '#' }
    },
  ];



  const testimonials = [
    {
      quote: `${companyName} transformed our payment infrastructure. Their reliability and support are unmatched in the industry.`,
      author: "Rahul Mehta",
      role: "CTO, FashionHub",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
    {
      quote: `The team at ${companyName} goes above and beyond. They're not just a vendor, they're a true partner in our growth.`,
      author: "Anjali Reddy",
      role: "Founder, FreshMart",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
    {
      quote: "99.9% uptime, instant settlements, and amazing API documentation. Couldn't ask for more from a payment partner.",
      author: "Vikram Singh",
      role: "CEO, TechSaaS",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
    },
  ];

  const offices = [
    {
      city: 'Bangalore',
      address: 'Embassy Tech Village, Outer Ring Road, Devarabeesanahalli, Bangalore - 560103',
      phone: '+91 80 1234 5678',
      email: settings.websiteEmail || 'contact@satyampay.com',
    },
    {
      city: 'Mumbai',
      address: 'BKC, Bandra East, Mumbai - 400051',
      phone: '+91 22 2345 6789',
      email: settings.websiteEmail || 'contact@satyampay.com',
    },
    {
      city: 'Singapore',
      address: 'Marina Bay Financial Centre, Tower 3, Singapore - 018982',
      phone: '+65 6789 0123',
      email: settings.websiteEmail || 'contact@satyampay.com',
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Building the future of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                digital payments
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              We're on a mission to make payments simple, secure, and accessible for every business in India and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/careers"
                className="group inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Join our team
                <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Contact us
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
                From a simple idea to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> India's trusted payment gateway</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Founded in 2019, {companyName} started with a simple observation: Indian businesses deserved better payment solutions. Complex integrations, hidden fees, and poor support were holding back entrepreneurs from focusing on what matters most - their business.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Today, we process over ₹50,000 crores annually for 10,000+ businesses, from innovative startups to established enterprises. But our mission remains the same: democratize digital payments and help businesses thrive in the digital economy.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-purple-500"></div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-gray-900">150+ team members</span>
                  <br />across 3 countries
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt={`${companyName} Team`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              </div>

              {/* Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">250%</div>
                    <div className="text-sm text-gray-600">Year-over-year growth</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Values</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
              What drives us every day
            </h2>
            <p className="text-gray-600 text-lg">
              These core principles guide our decisions, shape our culture, and define how we serve our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${value.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative p-8 text-center">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${value.color} rounded-xl mb-6 shadow-lg`}>
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Leadership</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Meet the minds behind {companyName}
            </h2>
            <p className="text-gray-600 text-lg">
              Experienced leaders passionate about building the future of payments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                        <Linkedin size={16} className="text-blue-600" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                        <Twitter size={16} className="text-blue-400" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} className="p-2 bg-white rounded-full hover:bg-blue-50 transition-colors">
                        <Github size={16} className="text-gray-900" />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-6">
              Trusted by businesses worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <Quote className="w-8 h-8 text-white/40 mb-4" />
                <p className="text-white/90 text-lg mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.author}</h4>
                    <p className="text-white/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Locations</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Our global presence
            </h2>
            <p className="text-gray-600 text-lg">
              With offices across India and Southeast Asia, we're always close to our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">{office.city}</h3>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{office.address}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <span className="text-gray-600">{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-gray-600">{office.email}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Join us in shaping the future of payments
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Whether you're a business looking for better payments or a talented individual wanting to make an impact, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get in touch
                <Mail size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/careers"
                className="group inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl border border-gray-200"
              >
                View careers
                <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Company;