import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, CreditCard, Building2 } from 'lucide-react';
import { kycAPI, getImageUrl } from '../../utils/api';

const KYCManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const fetchPendingKYC = async () => {
    try {
      const response = await kycAPI.getPendingKYC();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await kycAPI.approve(userId);
      setUsers(users.filter(u => u._id !== userId));
      setSelectedUser(null);
      alert('KYC Approved Successfully');
    } catch (error) {
      alert('Error approving KYC');
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    try {
      await kycAPI.reject(selectedUser._id, { reason: rejectReason });
      setUsers(users.filter(u => u._id !== selectedUser._id));
      setSelectedUser(null);
      setShowRejectModal(false);
      setRejectReason('');
      alert('KYC Rejected');
    } catch (error) {
      alert('Error rejecting KYC');
    }
  };

  const openRejectModal = (user) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KYC Management</h1>
        <p className="text-gray-500 mt-1">Review and approve user KYC submissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-amber-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-amber-700">{users.length}</p>
              <p className="text-amber-600 text-sm">Pending Approvals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">No pending KYC applications</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-900">{user.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(user.kyc?.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleApprove(user._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => openRejectModal(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedUser && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">KYC Details - {selectedUser.fullName}</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Aadhar Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="text-indigo-600" size={20} />
                  <h3 className="font-semibold">Aadhar Card</h3>
                </div>
                <p className="text-gray-600 mb-2">Number: {selectedUser.kyc?.aadhar?.number}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Front</p>
                    <img
                      src={getImageUrl(selectedUser.kyc?.aadhar?.frontImage)}
                      alt="Aadhar Front"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Back</p>
                    <img
                      src={getImageUrl(selectedUser.kyc?.aadhar?.backImage)}
                      alt="Aadhar Back"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              </div>

              {/* PAN Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="text-indigo-600" size={20} />
                  <h3 className="font-semibold">PAN Card</h3>
                </div>
                <p className="text-gray-600 mb-2">Number: {selectedUser.kyc?.pan?.number}</p>
                <img
                  src={getImageUrl(selectedUser.kyc?.pan?.image)}
                  alt="PAN Card"
                  className="w-full h-40 object-cover rounded-lg border"
                />
              </div>

              {/* Bank Details */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="text-indigo-600" size={20} />
                  <h3 className="font-semibold">Bank Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  <p><span className="text-gray-500">Account Holder:</span> {selectedUser.kyc?.bank?.accountHolderName}</p>
                  <p><span className="text-gray-500">Account No:</span> {selectedUser.kyc?.bank?.accountNumber}</p>
                  <p><span className="text-gray-500">IFSC:</span> {selectedUser.kyc?.bank?.ifscCode}</p>
                  <p><span className="text-gray-500">Bank:</span> {selectedUser.kyc?.bank?.bankName}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => openRejectModal(selectedUser)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => handleApprove(selectedUser._id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-red-600">Reject KYC</h2>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject KYC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCManagement;
