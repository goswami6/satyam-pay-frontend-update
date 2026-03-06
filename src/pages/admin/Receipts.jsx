import { useState, useEffect, useRef } from 'react';
import { Receipt, Send, Download, Eye, CheckCircle, Mail, Calendar, Search, Loader2, X, RefreshCw, Printer, FileText } from 'lucide-react';
import API from '../../utils/api';
import { useSettings } from '../../hooks/useSettings';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [resending, setResending] = useState(null);
  const [toast, setToast] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const receiptRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/transactions/receipts/all');
      setReceipts(res.data || []);
    } catch (error) {
      console.error('Error fetching receipts:', error);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const resendReceipt = async (transactionId, email = null) => {
    try {
      setResending(transactionId);
      const res = await API.post(`/transactions/receipt/send/${transactionId}`, { email });
      showToast(res.data.message, 'success');
      fetchReceipts();
      setSelectedReceipt(null);
      setCustomEmail('');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to resend receipt', 'error');
    } finally {
      setResending(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  // Download receipt as PDF
  const downloadPDF = (receipt) => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receipt.receiptNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f7fa; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; font-size: 24px; margin-bottom: 5px; }
          .header p { color: rgba(255,255,255,0.8); font-size: 14px; }
          .receipt-badge { display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; margin-top: 15px; }
          .content { padding: 30px; }
          .success-icon { width: 60px; height: 60px; background: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
          .success-icon svg { width: 30px; height: 30px; fill: white; }
          .status-text { text-align: center; margin-bottom: 20px; }
          .status-text h2 { color: #1f2937; font-size: 20px; }
          .status-text p { color: #6b7280; font-size: 14px; margin-top: 5px; }
          .amount-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
          .amount-box .label { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
          .amount-box .amount { color: #059669; font-size: 32px; font-weight: bold; }
          .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .details-table td { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .details-table td:first-child { color: #6b7280; font-size: 14px; }
          .details-table td:last-child { text-align: right; font-weight: 600; color: #1f2937; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #d1fae5; color: #059669; }
          .footer { background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer p { color: #6b7280; font-size: 12px; margin: 5px 0; }
          .footer strong { color: #1f2937; }
          @media print { 
            body { background: white; padding: 0; } 
            .container { box-shadow: none; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${settings.websiteName}</h1>
            <p>Payment Receipt</p>
            <span class="receipt-badge">Receipt #${receipt.receiptNumber}</span>
          </div>
          
          <div class="content">
            <div class="status-text">
              <div style="width: 60px; height: 60px; background: #10b981; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                <svg width="30" height="30" fill="white" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              </div>
              <h2>Payment Successful</h2>
              <p>Your payment has been processed successfully</p>
            </div>
            
            <div class="amount-box">
              <div class="label">Amount Received</div>
              <div class="amount">₹${Number(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
            
            <table class="details-table">
              <tr>
                <td>Transaction ID</td>
                <td>${receipt.transactionId || receipt._id}</td>
              </tr>
              <tr>
                <td>Receipt Number</td>
                <td>${receipt.receiptNumber}</td>
              </tr>
              <tr>
                <td>Date & Time</td>
                <td>${new Date(receipt.createdAt).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>Payment Method</td>
                <td style="text-transform: uppercase;">${receipt.method || 'N/A'}</td>
              </tr>
              <tr>
                <td>Category</td>
                <td style="text-transform: capitalize;">${receipt.category || 'Payment'}</td>
              </tr>
              ${receipt.customerName ? `<tr><td>Customer Name</td><td>${receipt.customerName}</td></tr>` : ''}
              ${receipt.fee > 0 ? `
              <tr>
                <td>Processing Fee</td>
                <td>₹${Number(receipt.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td>Net Amount</td>
                <td>₹${Number(receipt.netAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
              ` : ''}
              <tr>
                <td>Status</td>
                <td><span class="status-badge">${receipt.status}</span></td>
              </tr>
              <tr>
                <td>Sent To</td>
                <td>${receipt.receiptSentTo}</td>
              </tr>
            </table>
            
            ${receipt.notes ? `
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">Notes</p>
              <p style="margin: 5px 0 0; color: #1f2937;">${receipt.notes}</p>
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>This is an auto-generated receipt. Please keep it for your records.</p>
            <p style="margin-top: 10px;"><strong>${settings.websiteName}</strong></p>
            <p>Thank you for your business!</p>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; margin-right: 10px;">
            🖨️ Print Receipt
          </button>
          <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">
            ✖️ Close
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  };

  const filteredReceipts = receipts.filter(r => {
    const search = searchTerm.toLowerCase();
    return (
      r.receiptNumber?.toLowerCase().includes(search) ||
      r.transactionId?.toLowerCase().includes(search) ||
      r.receiptSentTo?.toLowerCase().includes(search) ||
      r.userId?.name?.toLowerCase().includes(search) ||
      r.userId?.email?.toLowerCase().includes(search)
    );
  });

  // Stats
  const totalReceiptsSent = receipts.length;
  const totalAmount = receipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const todayReceipts = receipts.filter(r => {
    const today = new Date();
    const sentDate = new Date(r.receiptSentAt);
    return sentDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <X size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Resend Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Resend Receipt</h3>
              <button
                onClick={() => { setSelectedReceipt(null); setCustomEmail(''); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Receipt Number</span>
                  <span className="text-sm font-medium text-purple-600">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-sm font-semibold text-gray-900">{formatAmount(selectedReceipt.amount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Previously Sent To</span>
                  <span className="text-sm text-gray-900">{selectedReceipt.receiptSentTo}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Send to different email (optional)
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder={selectedReceipt.receiptSentTo}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setSelectedReceipt(null); setCustomEmail(''); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => resendReceipt(selectedReceipt._id, customEmail || null)}
                  disabled={resending === selectedReceipt._id}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resending === selectedReceipt._id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Resend Receipt</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Receipt Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl">
              <div>
                <h3 className="text-lg font-semibold text-white">Payment Receipt</h3>
                <p className="text-blue-100 text-sm">#{viewReceipt.receiptNumber}</p>
              </div>
              <button
                onClick={() => setViewReceipt(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4" ref={receiptRef}>
              {/* Success Badge */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">Payment Successful</h4>
                <p className="text-gray-500 text-sm">Transaction completed successfully</p>
              </div>

              {/* Amount */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
                <p className="text-green-600 text-sm mb-1">Amount Received</p>
                <p className="text-3xl font-bold text-green-700">{formatAmount(viewReceipt.amount)}</p>
              </div>

              {/* Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Transaction ID</span>
                  <span className="font-mono text-sm text-blue-600">{viewReceipt.transactionId || viewReceipt._id?.slice(-10)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Receipt Number</span>
                  <span className="font-medium text-purple-600">{viewReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Date & Time</span>
                  <span className="text-gray-900 text-sm">{formatDate(viewReceipt.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Payment Method</span>
                  <span className="text-gray-900 text-sm uppercase">{viewReceipt.method || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Category</span>
                  <span className="text-gray-900 text-sm capitalize">{viewReceipt.category || 'Payment'}</span>
                </div>
                {viewReceipt.customerName && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 text-sm">Customer Name</span>
                    <span className="text-gray-900 text-sm">{viewReceipt.customerName}</span>
                  </div>
                )}
                {viewReceipt.fee > 0 && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Processing Fee</span>
                      <span className="text-red-600 text-sm">-{formatAmount(viewReceipt.fee)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 text-sm">Net Amount</span>
                      <span className="font-semibold text-gray-900">{formatAmount(viewReceipt.netAmount)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm">Status</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{viewReceipt.status}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Sent To</span>
                  <span className="text-gray-900 text-sm">{viewReceipt.receiptSentTo}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-blue-600 text-xs font-medium mb-2">USER DETAILS</p>
                <p className="text-gray-900 font-medium">{viewReceipt.userId?.fullName || 'N/A'}</p>
                <p className="text-gray-600 text-sm">{viewReceipt.userId?.email || 'N/A'}</p>
                {viewReceipt.userId?.phone && (
                  <p className="text-gray-600 text-sm">{viewReceipt.userId?.phone}</p>
                )}
              </div>

              {/* Notes */}
              {viewReceipt.notes && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-yellow-700 text-xs font-medium mb-1">NOTES</p>
                  <p className="text-gray-700 text-sm">{viewReceipt.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => downloadPDF(viewReceipt)}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => {
                  setViewReceipt(null);
                  setSelectedReceipt(viewReceipt);
                }}
                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>Resend</span>
              </button>
              <button
                onClick={() => setViewReceipt(null)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Receipts</h1>
          <p className="text-gray-600 mt-1">View and manage all sent payment receipts</p>
        </div>
        <button
          onClick={fetchReceipts}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 w-fit"
        >
          <RefreshCw size={18} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Receipts Sent</p>
              <p className="text-3xl font-bold mt-1">{totalReceiptsSent}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Receipt size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Amount</p>
              <p className="text-3xl font-bold mt-1">{formatAmount(totalAmount)}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Download size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Sent Today</p>
              <p className="text-3xl font-bold mt-1">{todayReceipts}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by receipt number, transaction ID, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Receipts List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-purple-600" />
          <span className="ml-3 text-gray-600">Loading receipts...</span>
        </div>
      ) : filteredReceipts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Receipt size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No receipts found</h3>
          <p className="text-gray-600 mt-1">
            {searchTerm ? 'Try a different search term' : 'Receipts will appear here once sent'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sent To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sent At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Receipt size={16} className="text-purple-500" />
                        <span className="text-sm font-medium text-purple-600">{receipt.receiptNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{receipt.userId?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{receipt.userId?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">{formatAmount(receipt.amount)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{receipt.receiptSentTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(receipt.receiptSentAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewReceipt(receipt)}
                          className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Receipt"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => downloadPDF(receipt)}
                          className="text-green-600 hover:text-green-800 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedReceipt(receipt)}
                          disabled={resending === receipt._id}
                          className="text-purple-600 hover:text-purple-800 p-1.5 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
                          title="Resend Receipt"
                        >
                          {resending === receipt._id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Send size={16} />
                          )}
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
    </div>
  );
};

export default Receipts;
