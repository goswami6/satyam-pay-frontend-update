import { Code, Terminal, Book, Key } from 'lucide-react';

const Developers = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Developers</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-3 bg-blue-100 rounded-lg inline-block mb-4">
            <Book className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">API Documentation</h3>
          <p className="text-sm text-gray-600 mb-4">Complete API reference and integration guides</p>
          <a href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">
            View Docs →
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-3 bg-green-100 rounded-lg inline-block mb-4">
            <Key className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">API Keys</h3>
          <p className="text-sm text-gray-600 mb-4">Manage your API keys and credentials</p>
          <a href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">
            Manage Keys →
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-3 bg-purple-100 rounded-lg inline-block mb-4">
            <Terminal className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Webhooks</h3>
          <p className="text-sm text-gray-600 mb-4">Configure webhooks for real-time events</p>
          <a href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">
            Setup Webhooks →
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
          <div className="p-3 bg-orange-100 rounded-lg inline-block mb-4">
            <Code className="text-orange-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">SDKs & Libraries</h3>
          <p className="text-sm text-gray-600 mb-4">Download SDKs for various platforms</p>
          <a href="#" className="text-sm text-blue-600 font-medium hover:text-blue-700">
            Browse SDKs →
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">API Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Payment API</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Refund API</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Settlement API</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Operational</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Webhook Delivery</span>
            </div>
            <span className="text-sm text-green-600 font-medium">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Developers;
