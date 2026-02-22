import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Download, Loader, IndianRupee } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { transactionAPI } from '../../utils/api';

const UserSettlements = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();

  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSettled: 0,
    pendingSettlement: 0,
    completedCount: 0
  });

  useEffect(() => {
    fetchSettlements();
  }, [userId]);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getTransactions(userId);

      // Filter only Credit transactions (money received/settled)
      const creditTransactions = response.data.filter(txn => txn.type === 'Credit');

      setSettlements(creditTransactions);

      // Calculate stats
      const completed = creditTransactions.filter(t => t.status === 'Completed');
      const pending = creditTransactions.filter(t => t.status === 'Pending');

      setStats({
        totalSettled: completed.reduce((sum, t) => sum + (t.amount || 0), 0),
        pendingSettlement: pending.reduce((sum, t) => sum + (t.amount || 0), 0),
        completedCount: completed.length
      });

    } catch (error) {
      console.error('Error fetching settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settlements</h1>
        <p className="text-gray-500 mt-1">Track your payment credits & settlements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Credited</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalSettled)}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Credits</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.pendingSettlement)}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Transactions</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">{settlements.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Credit History</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={18} />
            Download Report
          </button>
        </div>

        {settlements.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <IndianRupee className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No credit transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {settlements.map((settlement) => (
                  <tr key={settlement._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 font-mono">
                      {settlement.transactionId || settlement._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {settlement.description || 'Credit'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      +{formatCurrency(settlement.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${settlement.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        settlement.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {settlement.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(settlement.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettlements;
