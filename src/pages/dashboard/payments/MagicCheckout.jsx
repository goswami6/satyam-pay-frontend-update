import { Zap, Settings } from 'lucide-react';

const MagicCheckout = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Magic Checkout</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Settings size={18} />
          <span>Configure</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Magic Checkouts</h3>
          <p className="text-2xl font-bold text-gray-800">4,567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold text-green-600">96.8%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Avg. Time</h3>
          <p className="text-2xl font-bold text-blue-600">23s</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Revenue</h3>
          <p className="text-2xl font-bold text-gray-800">₹89,45,670</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Zap className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Magic Checkout</h2>
        <p className="text-gray-600 mb-6">One-click checkout experience powered by AI</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Enable Magic Checkout
        </button>
      </div>
    </div>
  );
};

export default MagicCheckout;
