import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useSettings } from '../hooks/useSettings';

const docs = {
  'credit-debit-cards': {
    title: 'Credit & Debit Cards',
    description: 'Accept payments from major credit and debit card networks including Visa, Mastercard, RuPay and Amex. Our gateway handles PCI compliance, tokenization, and fraud checks so you can focus on your business.',
    icon: '💳',
    color: 'from-blue-600 to-indigo-600',
    features: [
      'All major card networks',
      'EMI & installment support',
      'Secure tokenization (PCI-DSS compliant)',
      'Fraud detection with machine learning',
    ],
    benefits: [
      '98.5% success rate',
      'Instant settlements',
      '3D Secure 2.0 ready'
    ]
  },
  'digital-wallets': {
    title: 'Digital Wallets',
    description: 'Enable customers to pay using popular wallets such as PayTM, PhonePe, Google Pay, Amazon Pay and more. Wallet transactions are instant and offer a frictionless mobile experience.',
    icon: '📱',
    color: 'from-purple-600 to-pink-600',
    features: [
      'Support for top Indian wallets',
      'One-click checkout experience',
      'Automatic reconciliation',
      'Lower transaction fees',
    ],
    benefits: [
      '99% success rate',
      'Real-time settlement',
      'Zero MDR on small transactions'
    ]
  },
  'upi-payments': {
    title: 'UPI Payments',
    description: 'Unified Payments Interface (UPI) is the preferred payment instrument for millions of users. Accept UPI transactions via QR code, deep‑linking or intent flows with instant settlement.',
    icon: '🔢',
    color: 'from-green-600 to-teal-600',
    features: [
      'Interoperable across all banks',
      'QR code & deep‑link support',
      'Real‑time settlements',
      'Popular apps like Google Pay, PhonePe, PayTM',
    ],
    benefits: [
      '99.9% uptime',
      'Sub-second response',
      'Collect payments via UPI ID'
    ]
  },
  'recurring-payments': {
    title: 'Recurring Payments',
    description: 'Set up automated subscription billing or wallets top‑ups. Our recurring engine handles retries, dunning, and notify customers before charges.',
    icon: '🔄',
    color: 'from-orange-600 to-red-600',
    features: [
      'Flexible billing cycles',
      'Auto-retries on failure',
      'Customer self‑service portal',
      'Detailed reporting & analytics',
    ],
    benefits: [
      '85% recovery rate',
      'Smart retry logic',
      'Subscription analytics'
    ]
  },
  'net-banking': {
    title: 'Net Banking',
    description: 'Accept net banking transfers across all major Indian banks with instant payment confirmation and low failure rates. Customers can complete payments without leaving your site.',
    icon: '🏦',
    color: 'from-amber-600 to-yellow-600',
    features: [
      '350+ banks supported',
      'Instant order confirmation',
      'Low processing fees',
      'Easy integration via simple REST APIs',
    ],
    benefits: [
      'Highest success rate',
      'No additional integration',
      'Auto-refund on failure'
    ]
  },
  'emi-options': {
    title: 'EMI Options',
    description: 'Offer no-cost and standard EMI plans to customers using participating banks. EMIs increase average order value and conversion rates.',
    icon: '📊',
    color: 'from-cyan-600 to-blue-600',
    features: [
      'No-cost EMI choices',
      'Multiple tenures',
      'Bank-specific offers',
      'Transparent checkout UI',
    ],
    benefits: [
      '3x higher cart value',
      '15+ partner banks',
      'Instant EMI eligibility'
    ]
  },
};

const PaymentMethod = () => {
  const { settings } = useSettings();
  const { method } = useParams();
  const info = docs[method];

  if (!info) {
    return (
      <>
        <Navbar isLoggedIn={false} />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto px-6">
            <div className="bg-white p-12 rounded-3xl shadow-2xl">
              <div className="text-6xl mb-6">🔍</div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900">Documentation not found</h1>
              <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
              <Link
                to="/"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={false} />

      {/* Hero Section with Gradient */}
      <div className={`relative bg-gradient-to-r ${info.color} overflow-hidden`}>
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 md:w-64 md:h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 md:w-96 md:h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 mt-10">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all payment methods
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-white">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-4xl">{info.icon}</span>
                <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-4 py-2 rounded-full">
                  Payment Method
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                {info.title}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed mb-8">
                {info.description}
              </p>

              {/* Key Benefits Pills */}
              <div className="flex flex-wrap gap-3">
                {info.benefits.map((benefit, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column - Stats/Visual */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-white/80">Uptime SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">&lt;2s</div>
                  <div className="text-white/80">Avg. Response</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">24/7</div>
                  <div className="text-white/80">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">T+1</div>
                  <div className="text-white/80">Settlement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to accept {info.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to maximize your payment success rate and provide the best checkout experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {info.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mb-6`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature}</h3>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple integration, powerful results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with {info.title} in minutes with our developer-friendly APIs and SDKs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="relative">
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold`}>
                    {step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step === 1 && 'Integrate SDK'}
                    {step === 2 && 'Accept Payments'}
                    {step === 3 && 'Get Settled'}
                  </h3>
                  <p className="text-gray-600">
                    {step === 1 && 'Add our SDK to your app or website with just a few lines of code.'}
                    {step === 2 && 'Start accepting payments instantly with our intelligent routing.'}
                    {step === 3 && 'Receive settlements directly in your bank account within 24 hours.'}
                  </p>
                </div>
                {step < 3 && (
                  <div className="hidden md:block absolute top-16 left-[60%] w-full h-0.5 bg-gray-200">
                    <div className={`absolute right-0 w-3 h-3 bg-gradient-to-r ${info.color} rounded-full -top-1.5`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-r ${info.color} py-20`}>
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start accepting {info.title}?
          </h3>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of businesses that trust {settings.websiteName} for their payment processing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/api-documentation"
              className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View API Documentation
            </Link>
            <Link
              to="/signup"
              className="bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Integration →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentMethod;