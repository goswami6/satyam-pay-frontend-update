import { useEffect, useState } from "react";
import {
  Loader,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  User,
  IndianRupee,
  Calendar
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { bulkPayoutAPI } from "../../utils/api";

const AdminBulkPayouts = () => {
  const { getAuthHeader } = useAuth();

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  // ✅ Fetch Bulk Payouts
  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await bulkPayoutAPI.getAll();

      setPayouts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  // ✅ Approve
  const handleApprove = async (id) => {
    try {
      setActionLoading(id);

      await bulkPayoutAPI.approve(id);

      fetchPayouts();
    } catch (err) {
      alert("Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ Reject
  const handleReject = async (id) => {
    try {
      setActionLoading(id);

      await bulkPayoutAPI.reject(id);

      fetchPayouts();
    } catch (err) {
      alert("Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold">Bulk Payout Management</h1>
        <p className="text-gray-500">
          Review and process uploaded bulk payout files
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border overflow-x-auto">

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : payouts.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No bulk payouts found
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left border-b">
              <tr>
                <th className="p-4">File</th>
                <th className="p-4">User</th>
                <th className="p-4">Total Rows</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Uploaded</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {payouts.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">

                  <td className="p-4 flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-indigo-600" />
                    {item.fileName}
                  </td>

                  <td className="p-4 flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    {item.user?.fullName || "N/A"}
                  </td>

                  <td className="p-4">
                    {item.totalRows}
                  </td>

                  <td className="p-4 flex items-center gap-1 font-semibold">
                    <IndianRupee size={14} />
                    {Number(item.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${item.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-xs text-gray-600 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </td>

                  <td className="p-4 flex gap-3">

                    {item.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(item._id)}
                          disabled={actionLoading === item._id}
                          className="text-green-600 hover:text-green-800"
                        >
                          {actionLoading === item._id ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle size={16} />
                          )}
                        </button>

                        <button
                          onClick={() => handleReject(item._id)}
                          disabled={actionLoading === item._id}
                          className="text-red-600 hover:text-red-800"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default AdminBulkPayouts;
