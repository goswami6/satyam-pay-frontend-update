import { Smartphone, Plus } from 'lucide-react';

const POS = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Point of Sale (POS)</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={18} />
          <span>Register Device</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Active Devices</h3>
          <p className="text-2xl font-bold text-gray-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Today's Sales</h3>
          <p className="text-2xl font-bold text-green-600">₹45,670</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Transactions</h3>
          <p className="text-2xl font-bold text-blue-600">234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Avg. Transaction</h3>
          <p className="text-2xl font-bold text-gray-800">₹195</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Smartphone className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Point of Sale System</h2>
        <p className="text-gray-600 mb-6">Accept payments in-store with our POS devices</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default POS;
