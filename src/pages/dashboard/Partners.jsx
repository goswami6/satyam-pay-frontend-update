import { Users, Briefcase, TrendingUp, Award, HandshakeIcon } from 'lucide-react';

const Partners = () => {
  const partnerPrograms = [
    { 
      icon: Briefcase, 
      title: 'Business Partners', 
      description: 'Join our partner ecosystem and grow together',
      benefits: ['Revenue sharing', 'Co-marketing', 'Technical support'],
      color: 'blue'
    },
    { 
      icon: Users, 
      title: 'Referral Program', 
      description: 'Refer merchants and earn rewards',
      benefits: ['Attractive commissions', 'Easy tracking', 'Fast payouts'],
      color: 'green'
    },
    { 
      icon: TrendingUp, 
      title: 'Growth Partners', 
      description: 'Strategic partnerships for mutual growth',
      benefits: ['Exclusive insights', 'Priority support', 'Custom solutions'],
      color: 'purple'
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Partner Programs</h1>
          <p className="text-purple-100">Grow your business with our partnership opportunities</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerPrograms.map((program) => (
            <div key={program.title} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className={`p-3 bg-${program.color}-50 rounded-lg inline-block mb-4`}>
                <program.icon className={`text-${program.color}-600`} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{program.title}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <div className="space-y-2 mb-6">
                {program.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2">
                    <Award size={16} className="text-green-600" />
                    <span className="text-sm text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
                Learn More
              </button>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Become a Partner Today</h2>
              <p className="text-gray-600 mb-6">Join thousands of successful partners worldwide</p>
              <div className="flex space-x-4">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Apply Now
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View Requirements
                </button>
              </div>
            </div>
            <HandshakeIcon className="text-purple-200" size={120} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Partner Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Revenue & Growth</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Competitive revenue sharing model</li>
                <li>• Performance-based incentives</li>
                <li>• Quarterly bonus programs</li>
                <li>• Growth acceleration support</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Support & Resources</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Dedicated account manager</li>
                <li>• Marketing collateral & assets</li>
                <li>• Technical integration support</li>
                <li>• Training & certification programs</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Partners;
