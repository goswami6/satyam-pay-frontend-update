import { User, Edit, Share2 } from 'lucide-react';

const RazorpayMe = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Razorpay.me Link</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Edit size={18} />
          <span>Customize</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Payments</h3>
          <p className="text-2xl font-bold text-gray-800">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Amount Received</h3>
          <p className="text-2xl font-bold text-green-600">₹5,67,890</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Page Views</h3>
          <p className="text-2xl font-bold text-blue-600">3,456</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-blue-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Personal Payment Link</h2>
          <p className="text-gray-600 mb-6">paypanel.me/yourusername</p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Share2 size={18} />
              <span>Share Link</span>
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayMe;
