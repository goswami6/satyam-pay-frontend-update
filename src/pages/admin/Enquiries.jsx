import { useState, useEffect } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  FileText,
  Send,
  XCircle,
  MailOpen,
  MessageCircle,
} from "lucide-react";
import { enquiryAPI } from "../../utils/api";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
    limit: 20,
  });
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    read: 0,
    replied: 0,
    closed: 0,
  });
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus, pagination.currentPage]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = {
        status: filterStatus,
        search: searchQuery,
        page: pagination.currentPage,
        limit: pagination.limit,
      };
      const response = await enquiryAPI.getAll(params);
      if (response.data.success) {
        setEnquiries(response.data.data);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchEnquiries();
  };

  const viewEnquiry = async (enquiry) => {
    try {
      const response = await enquiryAPI.getById(enquiry._id);
      if (response.data.success) {
        setSelectedEnquiry(response.data.data);
        setAdminNotes(response.data.data.adminNotes || "");
        setShowModal(true);
        // Refresh list to show updated status
        fetchEnquiries();
      }
    } catch (error) {
      console.error("Error fetching enquiry:", error);
    }
  };

  const updateEnquiryStatus = async (status) => {
    if (!selectedEnquiry) return;
    try {
      setUpdating(true);
      await enquiryAPI.update(selectedEnquiry._id, { status, adminNotes });
      setSelectedEnquiry((prev) => ({ ...prev, status, adminNotes }));
      fetchEnquiries();
    } catch (error) {
      console.error("Error updating enquiry:", error);
    } finally {
      setUpdating(false);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await enquiryAPI.delete(id);
      setShowModal(false);
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected enquiries?`)) return;
    try {
      await enquiryAPI.bulkDelete(selectedIds);
      setSelectedIds([]);
      fetchEnquiries();
    } catch (error) {
      console.error("Error bulk deleting:", error);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === enquiries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(enquiries.map((e) => e._id));
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      read: "bg-yellow-100 text-yellow-700 border-yellow-200",
      replied: "bg-green-100 text-green-700 border-green-200",
      closed: "bg-gray-100 text-gray-700 border-gray-200",
    };
    const icons = {
      new: <AlertCircle size={14} />,
      read: <Eye size={14} />,
      replied: <CheckCircle size={14} />,
      closed: <XCircle size={14} />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-600 mt-1">Manage contact form submissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total", value: stats.total, icon: MessageSquare, color: "blue" },
          { label: "New", value: stats.new, icon: AlertCircle, color: "indigo" },
          { label: "Read", value: stats.read, icon: Eye, color: "yellow" },
          { label: "Replied", value: stats.replied, icon: CheckCircle, color: "green" },
          { label: "Closed", value: stats.closed, icon: XCircle, color: "gray" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchEnquiries}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedIds.length} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageSquare size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No enquiries found</p>
            <p className="text-gray-400 text-sm">Contact form submissions will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === enquiries.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {enquiries.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    className={`hover:bg-gray-50 transition-colors ${enquiry.status === "new" ? "bg-blue-50/30" : ""
                      }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(enquiry._id)}
                        onChange={() => toggleSelect(enquiry._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {enquiry.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{enquiry.fullName}</p>
                          <p className="text-sm text-gray-500">{enquiry.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-900 font-medium truncate max-w-xs">
                        {enquiry.subject}
                      </p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {enquiry.message.slice(0, 50)}...
                      </p>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(enquiry.status)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        {formatDate(enquiry.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewEnquiry(enquiry)}
                          className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => deleteEnquiry(enquiry._id)}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of{" "}
              {pagination.total} enquiries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage - 1,
                  }))
                }
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: prev.currentPage + 1,
                  }))
                }
                disabled={pagination.currentPage === pagination.pages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Enquiry Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle size={24} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{selectedEnquiry.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Mail size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${selectedEnquiry.email}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {selectedEnquiry.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Phone size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedEnquiry.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <FileText size={18} className="text-blue-600" />
                  <p className="text-sm font-semibold text-blue-700">Subject</p>
                </div>
                <p className="text-gray-900 font-medium">{selectedEnquiry.subject}</p>
              </div>

              {/* Message */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle size={18} className="text-gray-600" />
                  <p className="text-sm font-semibold text-gray-700">Message</p>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </p>
              </div>

              {/* Status Update */}
              <div className="p-4 border border-gray-200 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 mb-3">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {["new", "read", "replied", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateEnquiryStatus(status)}
                      disabled={updating || selectedEnquiry.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedEnquiry.status === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } disabled:opacity-50`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this enquiry..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={() => updateEnquiryStatus(selectedEnquiry.status)}
                  disabled={updating}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <button
                onClick={() => deleteEnquiry(selectedEnquiry._id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Enquiry
              </button>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${selectedEnquiry.subject}`}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Send size={16} />
                  Reply via Email
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;
