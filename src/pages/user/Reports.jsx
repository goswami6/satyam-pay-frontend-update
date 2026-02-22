import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Download,
  Calendar,
  Loader,
  CheckCircle,
  Trash2,
  X,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { reportAPI } from "../../utils/api";

const UserReports = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();

  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
    to: new Date().toISOString().split("T")[0],
  });

  const reportTypes = [
    {
      type: "transaction",
      icon: BarChart3,
      title: "Transaction Report",
      description: "Complete transaction history with all credits and debits",
      color: "indigo",
    },
    {
      type: "revenue",
      icon: TrendingUp,
      title: "Revenue Report",
      description: "All incoming payments and revenue analytics",
      color: "emerald",
    },
    {
      type: "settlement",
      icon: FileText,
      title: "Settlement Report",
      description: "Withdrawal and settlement details",
      color: "purple",
    },
    {
      type: "custom",
      icon: Download,
      title: "Custom Export",
      description: "Export data for custom date range",
      color: "amber",
    },
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [reportsRes, statsRes] = await Promise.all([
        reportAPI.getUserReports(userId),
        reportAPI.getStats(userId),
      ]);

      setReports(reportsRes.data.reports || []);
      setStats(statsRes.data.stats || null);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, fetchData]);

  const handleGenerateClick = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleGenerate = async () => {
    if (!selectedType) return;

    try {
      setGenerating(selectedType);
      setShowModal(false);

      await reportAPI.generate({
        userId,
        type: selectedType,
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
      });

      await fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate report");
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = async (reportId, title) => {
    try {
      setDownloading(reportId);
      const response = await reportAPI.download(reportId);

      // Create download link
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "_")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to download report");
    } finally {
      setDownloading(null);
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await reportAPI.delete(reportId);
      setReports(reports.filter((r) => r.reportId !== reportId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete report");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeIcon = (type) => {
    const reportType = reportTypes.find((r) => r.type === type);
    return reportType?.icon || FileText;
  };

  const getTypeColor = (type) => {
    const colors = {
      transaction: "indigo",
      revenue: "emerald",
      settlement: "purple",
      custom: "amber",
    };
    return colors[type] || "slate";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reports</h1>
          <p className="text-slate-500 mt-1">Generate and download financial reports</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Month Revenue</p>
              {stats.growthPercent !== 0 && (
                <span
                  className={`flex items-center text-xs font-bold ${stats.growthPercent > 0 ? "text-emerald-600" : "text-red-600"
                    }`}
                >
                  {stats.growthPercent > 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {Math.abs(stats.growthPercent)}%
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-emerald-600 mt-2">
              ₹{stats.currentMonth.revenue.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Month Expenses</p>
            <h3 className="text-2xl font-black text-red-600 mt-2">
              ₹{stats.currentMonth.expenses.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">All Time Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 mt-2">
              ₹{stats.allTime.revenue.toLocaleString("en-IN")}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reports Generated</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-2">{stats.reportsGenerated}</h3>
          </div>
        </div>
      )}

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isGenerating = generating === report.type;

          return (
            <div
              key={report.type}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 bg-${report.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-6 h-6 text-${report.color}-600`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{report.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{report.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleGenerateClick(report.type)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Reports</h2>
          <span className="text-sm text-slate-400">{reports.length} reports</span>
        </div>

        {reports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="font-bold text-slate-700">No Reports Yet</h3>
            <p className="text-sm text-slate-400 mt-1">Generate your first report to see it here</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {reports.map((report) => {
              const Icon = getTypeIcon(report.type);
              const color = getTypeColor(report.type);

              return (
                <div
                  key={report.reportId}
                  className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${color}-600`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{report.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400">
                          Generated {formatDate(report.createdAt)}
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-500">
                          {report.summary.totalTransactions} transactions
                        </span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs font-bold text-emerald-600">
                          ₹{report.summary.totalCredit.toLocaleString("en-IN")} received
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(report.reportId, report.title)}
                      disabled={downloading === report.reportId}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:bg-slate-200 transition-colors"
                    >
                      {downloading === report.reportId ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(report.reportId)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Generate Report</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-sm font-bold text-indigo-700">
                  {reportTypes.find((r) => r.type === selectedType)?.title}
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  {reportTypes.find((r) => r.type === selectedType)?.description}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 ml-1">Date Range</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-[10px] text-slate-400 ml-1">From</label>
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 ml-1">To</label>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserReports;
