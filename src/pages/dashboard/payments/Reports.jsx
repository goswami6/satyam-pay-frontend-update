import { BarChart3, Download, Calendar, FileText } from 'lucide-react';

const Reports = () => {
  const reportTypes = [
    { 
      title: 'Transaction Report', 
      description: 'Detailed report of all transactions with filters', 
      icon: FileText, 
      color: 'blue' 
    },
    { 
      title: 'Settlement Report', 
      description: 'Summary of all settlements and payouts', 
      icon: BarChart3, 
      color: 'green' 
    },
    { 
      title: 'Revenue Report', 
      description: 'Revenue breakdown by payment methods', 
      icon: BarChart3, 
      color: 'purple' 
    },
    { 
      title: 'Customer Report', 
      description: 'Customer analytics and insights', 
      icon: FileText, 
      color: 'orange' 
    },
  ];

  const recentReports = [
    { name: 'January_Transactions.csv', date: '2026-02-01', size: '2.4 MB', status: 'Ready' },
    { name: 'December_Revenue.pdf', date: '2026-01-05', size: '1.1 MB', status: 'Ready' },
    { name: 'Q4_2025_Summary.xlsx', date: '2025-12-31', size: '3.8 MB', status: 'Ready' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => (
          <div key={report.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`p-3 bg-${report.color}-100 rounded-lg inline-block mb-4`}>
              <report.icon className={`text-${report.color}-600`} size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{report.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{report.description}</p>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
              Generate Report →
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Custom Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Transaction Report</option>
              <option>Settlement Report</option>
              <option>Revenue Report</option>
              <option>Customer Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Custom Range</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>CSV</option>
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Download size={18} />
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Reports</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentReports.map((report) => (
            <div key={report.name} className="p-6 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-500">Generated on {report.date} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {report.status}
                </span>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
