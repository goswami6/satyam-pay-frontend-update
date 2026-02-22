import { Download, BarChart3, TrendingUp, Activity } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    { 
      icon: TrendingUp, 
      title: 'Revenue Reports', 
      description: 'Detailed revenue analysis and trends',
      color: 'green',
      stats: '₹45,67,890 this month'
    },
    { 
      icon: BarChart3, 
      title: 'Gateway Performance', 
      description: 'Success rates and performance metrics',
      color: 'blue',
      stats: '97.8% success rate'
    },
    { 
      icon: Activity, 
      title: 'User Activity Reports', 
      description: 'User behavior and engagement analytics',
      color: 'purple',
      stats: '4,567 active users'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <div key={report.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className={`p-3 bg-${report.color}-100 rounded-lg inline-block mb-4`}>
              <report.icon className={`text-${report.color}-600`} size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-600 mb-4">{report.description}</p>
            <p className="text-sm font-semibold text-gray-900 mb-4">{report.stats}</p>
            <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
              <Download size={18} />
              <span>Generate Report</span>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Custom Report Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Revenue Report</option>
              <option>Transaction Report</option>
              <option>Settlement Report</option>
              <option>User Activity Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>PDF</option>
              <option>CSV</option>
              <option>Excel</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
              <Download size={18} />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
