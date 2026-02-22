import { ShoppingCart, TrendingUp } from 'lucide-react';

const Checkout = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Checkouts</h3>
          <p className="text-2xl font-bold text-gray-800">8,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Success Rate</h3>
          <p className="text-2xl font-bold text-green-600">94.5%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Cart Abandonment</h3>
          <p className="text-2xl font-bold text-orange-600">5.5%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Revenue</h3>
          <p className="text-2xl font-bold text-gray-800">₹98,45,670</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Checkout Integration</h2>
        <p className="text-gray-600 mb-6">Seamless checkout experience for your customers</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          View Documentation
        </button>
      </div>
    </div>
  );
};

export default Checkout;
