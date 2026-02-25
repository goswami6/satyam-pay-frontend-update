import { useCallback, useEffect, useState } from "react";
import {
  Download,
  BarChart3,
  TrendingUp,
  Activity,
  FileText,
  RefreshCw,
  Calendar,
  Trash2,
  Users,
  Loader,
} from "lucide-react";
import { reportAPI } from "../../utils/api";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatCurrency = (value = 0) => currencyFormatter.format(Number(value || 0));
const formatNumber = (value = 0) => new Intl.NumberFormat("en-IN").format(Number(value || 0));

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Form state for custom report
  const [reportType, setReportType] = useState("transaction");
  const [dateRange, setDateRange] = useState("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, reportsRes] = await Promise.all([
        reportAPI.adminGetStats(),
        reportAPI.adminGetAll(),
      ]);
      setStats(statsRes.data?.stats || null);
      setReports(reportsRes.data?.reports || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load reports data", err);
      setError(err.response?.data?.message || "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDateRange = () => {
    const now = new Date();
    let from, to;
    to = now.toISOString();

    if (dateRange === "custom" && customFrom && customTo) {
      return { dateFrom: customFrom, dateTo: customTo };
    }

    const days = parseInt(dateRange) || 30;
    from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    return { dateFrom: from, dateTo: to };
  };

  const handleGenerateReport = async (type) => {
    try {
      setGenerating(true);
      const { dateFrom, dateTo } = getDateRange();
      await reportAPI.adminGenerate({ type, dateFrom, dateTo });
      await fetchData();
      alert("Report generated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId, title) => {
    try {
      const response = await reportAPI.download(reportId);
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to download report");
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await reportAPI.delete(reportId);
      setReports(reports.filter((r) => r.reportId !== reportId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete report");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading && !stats) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading reports...
        </div>
      </div>
    );
  }

  const safeStats = {
    currentMonth: { transactions: 0, revenue: 0, expenses: 0, net: 0 },
    allTime: { transactions: 0, revenue: 0, expenses: 0, net: 0 },
    settlements: { total: 0, count: 0 },
    reportsGenerated: 0,
    activeUsers: 0,
    growthPercent: 0,
    ...stats,
  };

  // Pagination logic
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = reports.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const reportTypes = [
    {
      icon: TrendingUp,
      title: "Revenue Reports",
      description: "Detailed revenue analysis and trends",
      color: "green",
      type: "revenue",
      stats: formatCurrency(safeStats.currentMonth.revenue) + " this month",
    },
    {
      icon: BarChart3,
      title: "Transaction Reports",
      description: "All platform transactions summary",
      color: "blue",
      type: "transaction",
      stats: formatNumber(safeStats.currentMonth.transactions) + " transactions",
    },
    {
      icon: Activity,
      title: "Settlement Reports",
      description: "Withdrawal and settlement records",
      color: "purple",
      type: "settlement",
      stats: formatCurrency(safeStats.settlements.total) + " settled",
    },
    {
      icon: Users,
      title: "User Activity Reports",
      description: "User registrations and activity",
      color: "orange",
      type: "user",
      stats: formatNumber(safeStats.activeUsers) + " active users",
    },
  ];

  const colorClasses = {
    green: { bg: "bg-green-100", text: "text-green-600" },
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    orange: { bg: "bg-orange-100", text: "text-orange-600" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive business insights and analytics</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">This Month Revenue</p>
          <p className="text-2xl font-black text-gray-900 mt-2">{formatCurrency(safeStats.currentMonth.revenue)}</p>
          <p className="text-sm text-green-600 mt-1">+{safeStats.growthPercent}% from last month</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">All Time Revenue</p>
          <p className="text-2xl font-black text-gray-900 mt-2">{formatCurrency(safeStats.allTime.revenue)}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Total Settlements</p>
          <p className="text-2xl font-black text-gray-900 mt-2">{formatCurrency(safeStats.settlements.total)}</p>
          <p className="text-sm text-gray-500 mt-1">{formatNumber(safeStats.settlements.count)} withdrawals</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Reports Generated</p>
          <p className="text-2xl font-black text-gray-900 mt-2">{formatNumber(safeStats.reportsGenerated)}</p>
        </div>
      </div>

      {/* Quick Report Generation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const colors = colorClasses[report.color] || colorClasses.blue;
          return (
            <div
              key={report.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className={`p-3 ${colors.bg} rounded-lg inline-block mb-4`}>
                <report.icon className={colors.text} size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <p className="text-sm font-semibold text-gray-900 mb-4">{report.stats}</p>
              <button
                onClick={() => handleGenerateReport(report.type)}
                disabled={generating}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {generating ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                <span>Generate Report</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Custom Report Generator */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Custom Report Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="revenue">Revenue Report</option>
              <option value="transaction">Transaction Report</option>
              <option value="settlement">Settlement Report</option>
              <option value="user">User Activity Report</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last 1 year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {dateRange === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          <div className="flex items-end">
            <button
              onClick={() => handleGenerateReport(reportType)}
              disabled={generating}
              className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {generating ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              <span>Generate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Reports</h2>
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No reports generated yet</p>
            <p className="text-sm text-gray-400 mt-1">Generate your first report using the options above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">Report ID</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">Records</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">Net Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">Created</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.map((report) => (
                  <tr key={report.reportId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono text-gray-600">{report.reportId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{report.title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-indigo-100 text-indigo-700 capitalize">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-700">{formatNumber(report.summary?.totalTransactions || 0)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${report.summary?.netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(report.summary?.netAmount || 0)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-500">{formatDate(report.createdAt)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(report.reportId, report.title)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Download CSV"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report.reportId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              <div className="text-sm text-gray-600">
                Showing {reports.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, reports.length)} of {reports.length} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`px-3 py-1 text-sm border rounded ${currentPage === page
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : page === '...'
                          ? 'border-transparent cursor-default'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
