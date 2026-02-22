import { QrCode, Plus, Download } from 'lucide-react';

const QRCodes = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">QR Codes</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={18} />
          <span>Generate QR</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Active QR Codes</h3>
          <p className="text-2xl font-bold text-gray-800">48</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Total Scans</h3>
          <p className="text-2xl font-bold text-blue-600">12,456</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Successful Payments</h3>
          <p className="text-2xl font-bold text-green-600">9,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm text-gray-600 mb-2">Amount Collected</h3>
          <p className="text-2xl font-bold text-gray-800">₹18,45,670</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
          <QrCode className="text-gray-400" size={96} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Dynamic QR Codes</h2>
        <p className="text-gray-600 mb-6">Generate QR codes for accepting payments anywhere</p>
        <div className="flex justify-center space-x-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus size={18} />
            <span>Create QR Code</span>
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download size={18} />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodes;
