import { useState, useEffect, useCallback } from "react";
import {
  QrCode,
  Search,
  RefreshCw,
  Trash2,
  Eye,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Download,
  ExternalLink,
  Smartphone,
} from "lucide-react";
import { qrCodeAPI } from "../../utils/api";

const QRManagement = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, paid: 0, expired: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [selectedQR, setSelectedQR] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchQRCodes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await qrCodeAPI.getAdminAll({
        status: filter,
        search: search || undefined,
        page,
        limit: 30,
      });
      setQrCodes(response.data.qrCodes || []);
      setStats(response.data.stats || { total: 0, active: 0, paid: 0, expired: 0, totalAmount: 0 });
      setPagination(response.data.pagination || { total: 0, totalPages: 1 });
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, search, page]);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  // Reset page when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const handleDelete = async (qrId) => {
    if (!window.confirm("Are you sure you want to delete this QR code?")) return;
    try {
      setDeleting(qrId);
      await qrCodeAPI.delete(qrId);
      fetchQRCodes();
    } catch (error) {
      alert("Failed to delete QR code");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusBadge = (status) => {
    const map = {
      active: "bg-green-100 text-green-700",
      paid: "bg-blue-100 text-blue-700",
      expired: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${map[status] || "bg-gray-100 text-gray-500"}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="w-7 h-7 text-indigo-600" />
            QR Code Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage all QR codes from all users</p>
        </div>
        <button
          onClick={fetchQRCodes}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "bg-gray-50 border-gray-200 text-gray-700" },
          { label: "Active", value: stats.active, color: "bg-green-50 border-green-200 text-green-700" },
          { label: "Paid", value: stats.paid, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Expired", value: stats.expired, color: "bg-red-50 border-red-200 text-red-700" },
          { label: "Revenue", value: `₹${stats.totalAmount?.toLocaleString("en-IN") || 0}`, color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-3 ${s.color}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-lg sm:text-xl font-bold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by QR ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paid">Paid</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="ml-2 text-gray-500">Loading QR codes...</span>
          </div>
        ) : qrCodes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <QrCode className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No QR codes found</p>
            <p className="text-sm mt-1">No QR codes match your current filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">QR ID</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Gateway</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Created</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {qrCodes.map((qr) => (
                  <tr key={qr.qrId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-indigo-600">{qr.qrId}</span>
                      {qr.isStatic && (
                        <span className="ml-1 text-[10px] bg-purple-100 text-purple-600 px-1 rounded">Static</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <div>
                          <p className="text-xs font-medium text-gray-900 truncate max-w-[120px]">{qr.userName}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[120px]">{qr.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-700 truncate max-w-[120px]">{qr.name || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {qr.amount ? (
                        <span className="font-semibold text-gray-900">₹{qr.amount.toLocaleString("en-IN")}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Dynamic</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {qr.gateway ? (
                        <span className="text-[10px] font-medium bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">
                          {qr.gateway}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                      {qr.isUpiQr && (
                        <Smartphone className="inline-block w-3 h-3 text-green-500 ml-1" title="UPI QR" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">{statusBadge(qr.status)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{formatDate(qr.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedQR(selectedQR?.qrId === qr.qrId ? null : qr)}
                          className="p-1 rounded hover:bg-indigo-50 text-indigo-500"
                          title="View details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(qr.qrId)}
                          disabled={deleting === qr.qrId}
                          className="p-1 rounded hover:bg-red-50 text-red-400 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50">
            <p className="text-xs text-gray-500">
              Showing {(page - 1) * 30 + 1}–{Math.min(page * 30, pagination.total)} of {pagination.total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs px-2">{page} / {pagination.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedQR && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-600" />
              QR Details — {selectedQR.qrId}
            </h3>
            <button onClick={() => setSelectedQR(null)} className="text-gray-400 hover:text-gray-600">
              <XCircle size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-400">User</p>
              <p className="font-medium">{selectedQR.userName}</p>
              <p className="text-xs text-gray-400">{selectedQR.userEmail}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Amount</p>
              <p className="font-bold text-lg">
                {selectedQR.amount ? `₹${selectedQR.amount.toLocaleString("en-IN")}` : "Dynamic"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Status</p>
              <div className="mt-1">{statusBadge(selectedQR.status)}</div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Gateway</p>
              <p className="font-medium">{selectedQR.gateway || "Hosted Checkout"}</p>
              {selectedQR.isUpiQr && (
                <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded mt-0.5 inline-block">UPI QR</span>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400">Created</p>
              <p>{formatDate(selectedQR.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Expires</p>
              <p>{selectedQR.expiresAt ? formatDate(selectedQR.expiresAt) : "No expiry"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Type</p>
              <p>{selectedQR.isStatic ? "Static" : "Dynamic"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Description</p>
              <p className="truncate">{selectedQR.description || "—"}</p>
            </div>
          </div>
          {selectedQR.gatewayQrImageUrl && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Gateway QR Image</p>
              <img
                src={selectedQR.gatewayQrImageUrl}
                alt="Gateway QR"
                className="w-40 h-40 rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QRManagement;
