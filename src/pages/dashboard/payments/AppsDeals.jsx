import { Package, ExternalLink } from 'lucide-react';

const AppsDeals = () => {
  const apps = [
    { name: 'Accounting Software', category: 'Finance', discount: '20% OFF', logo: '📊', description: 'Integrate with leading accounting platforms' },
    { name: 'CRM Integration', category: 'Sales', discount: '15% OFF', logo: '🤝', description: 'Connect with popular CRM systems' },
    { name: 'Analytics Suite', category: 'Analytics', discount: '30% OFF', logo: '📈', description: 'Advanced payment analytics tools' },
    { name: 'Email Marketing', category: 'Marketing', discount: '25% OFF', logo: '📧', description: 'Automated email campaigns' },
    { name: 'Inventory Manager', category: 'Operations', discount: '10% OFF', logo: '📦', description: 'Sync payments with inventory' },
    { name: 'Tax Calculator', category: 'Finance', discount: '20% OFF', logo: '💰', description: 'Automated tax calculations' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Apps & Deals</h1>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Exclusive Partner Deals</h2>
        <p className="text-blue-100 mb-4">Get special discounts on premium business tools</p>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
          Explore All Deals
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.name} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{app.logo}</div>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {app.discount}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{app.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{app.category}</p>
              <p className="text-sm text-gray-600 mb-4">{app.description}</p>
              <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                <span>View Details</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Package className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Looking for More Integrations?</h2>
        <p className="text-gray-600 mb-6">Browse our complete marketplace of apps and integrations</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Visit Marketplace
        </button>
      </div>
    </div>
  );
};

export default AppsDeals;
