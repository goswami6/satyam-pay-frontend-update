import { FileText, Plus } from 'lucide-react';

const DigitalBilling = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Digital Billing</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={18} />
          <span>Create Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Invoices</h3>
          <p className="text-2xl font-bold text-gray-800">247</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Paid Invoices</h3>
          <p className="text-2xl font-bold text-green-600">198</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Pending Amount</h3>
          <p className="text-2xl font-bold text-orange-600">₹1,45,670</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Digital Billing Portal</h2>
        <p className="text-gray-600 mb-6">Create and manage digital invoices for your customers</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default DigitalBilling;
