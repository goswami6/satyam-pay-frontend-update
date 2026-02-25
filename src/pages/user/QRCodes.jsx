import { useState, useEffect, useCallback } from "react";
// Modal for in-page payment gateway (desktop)
function PaymentGatewayModal({ url, open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-xl shadow-lg flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-2xl font-bold z-10"
          onClick={onClose}
        >
          &times;
        </button>
        <iframe
          src={url}
          title="Payment Gateway"
          className="flex-1 w-full rounded-b-xl border-0"
          style={{ minHeight: '70vh' }}
          allow="payment *"
        />
      </div>
    </div>
  );
}
import {
  QrCode,
  Plus,
  Download,
  IndianRupee,
  Clock,
  Trash2,
  CheckCircle,
  Loader,
  Copy,
  ExternalLink,
  X,
  Infinity,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../context/AuthContext";
import { qrCodeAPI, gatewayAPI, razorpayQRAPI } from "../../utils/api";

const UserQRCodes = () => {
  // Modal state for desktop in-page payment
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const { getUserId } = useAuth();
  const userId = getUserId();

  const [qrCodes, setQrCodes] = useState([]);
  const [staticQR, setStaticQR] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, paid: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingStatic, setGeneratingStatic] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [activeGateway, setActiveGateway] = useState(null);

  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    description: "",
    expiryMinutes: 15,
  });

  const fetchQRCodes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await qrCodeAPI.getUserQRCodes(userId);
      console.log('QR API response:', response.data); // DEBUG
      setQrCodes(response.data.qrCodes || []);
      setStaticQR(response.data.staticQR || null);
      setStats(response.data.stats || { total: 0, active: 0, paid: 0, totalAmount: 0 });
    } catch (error) {
      console.error("Error fetching QR codes:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchQRCodes();
    }
    // Fetch active gateway for display
    gatewayAPI.getActive().then(res => {
      if (res.data && res.data.gateway) {
        setActiveGateway(res.data);
      }
    }).catch(() => setActiveGateway(null));
  }, [userId, fetchQRCodes]);

  const handleGenerate = async () => {
    if (!formData.amount || Number(formData.amount) <= 0) {
      return alert("Please enter a valid amount");
    }

    try {
      setGenerating(true);
      // Always use the DB-backed QR API so the checkout page works for all gateways
      const response = await qrCodeAPI.generate({
        userId,
        amount: Number(formData.amount),
        name: formData.name || "Payment QR",
        description: formData.description,
        expiryMinutes: Number(formData.expiryMinutes),
      });
      const newQR = {
        ...response.data.qrCode,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      setSelectedQR(newQR);
      setQrCodes([newQR, ...qrCodes]);
      setShowModal(false);
      setFormData({ amount: "", name: "", description: "", expiryMinutes: 15 });
      fetchQRCodes();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateStaticQR = async () => {
    try {
      setGeneratingStatic(true);
      const response = await qrCodeAPI.generateStatic({
        userId,
        name: "My Static QR",
        description: "Accept payments of any amount",
      });

      setStaticQR(response.data.qrCode);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate static QR");
    } finally {
      setGeneratingStatic(false);
    }
  };

  const handleDelete = async (qrId) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return;

    try {
      await qrCodeAPI.delete(qrId);
      setQrCodes(qrCodes.filter((qr) => qr.qrId !== qrId));
      if (selectedQR?.qrId === qrId) setSelectedQR(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete QR code");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getHostedPaymentUrl = (qr) => {
    return qr?.hostedCheckoutUrl || `${window.location.origin}/qr/${qr?.qrId}`;
  };

  const getQRValue = (qr) => {
    // If gateway direct payment URL exists, encode that so scanning pays directly
    if (qr?.gatewayPaymentUrl) return qr.gatewayPaymentUrl;
    // Fallback to hosted checkout
    return getHostedPaymentUrl(qr);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
            Active
          </span>
        );
      case "paid":
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
            Paid
          </span>
        );
      case "expired":
        return (
          <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">
            Expired
          </span>
        );
      default:
        return null;
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

  const downloadQR = (qrId) => {
    // Check if it's a gateway QR image (IMG element, not SVG)
    const el = document.getElementById(`qr-${qrId}`);
    if (!el) return;

    if (el.tagName === "IMG") {
      // Gateway QR image - download from URL
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${qrId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = el.src;
      return;
    }

    // SVG QR code
    const svgData = new XMLSerializer().serializeToString(el);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QR_${qrId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">QR Codes</h1>
          <p className="text-slate-500 mt-1">Generate dynamic QR codes for instant payments</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchQRCodes}
            className="flex items-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors border border-slate-200"
            title="Refresh QR List"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 19A9 9 0 1 1 19 5.633" /></svg>
            Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            Generate QR Code
          </button>
        </div>
      </div>

      {/* Static QR Section */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Infinity className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">Static QR Code</span>
            </div>
            <h2 className="text-2xl font-black">Accept Any Amount</h2>
            <p className="text-sm text-white/70 mt-1">
              Generate a permanent QR code that never expires. Customers can enter any amount while paying.
            </p>
          </div>

          {staticQR ? (
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl border border-white/30">
                {staticQR.gatewayQrImageUrl ? (
                  <img
                    id={`qr-static-${staticQR.qrId}`}
                    src={staticQR.gatewayQrImageUrl}
                    alt="Static QR"
                    className="w-[100px] h-[100px]"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <QRCodeSVG
                    id={`qr-static-${staticQR.qrId}`}
                    value={getQRValue(staticQR)}
                    size={100}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                    includeMargin={true}
                  />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-xs text-white/60">{staticQR.qrId}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(getHostedPaymentUrl(staticQR), "static")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors"
                  >
                    {copiedId === "static" ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copy Link
                  </button>
                  <button
                    onClick={() => downloadQR(`static-${staticQR.qrId}`)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
                <a
                  href={getHostedPaymentUrl(staticQR)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Preview Payment Page
                </a>
              </div>
            </div>
          ) : (
            <button
              onClick={handleGenerateStaticQR}
              disabled={generatingStatic}
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {generatingStatic ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  Generate Static QR
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total QR Codes</p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">{stats.total}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">{stats.active}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Paid</p>
          <h3 className="text-2xl font-black text-blue-600 mt-2">{stats.paid}</h3>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Received</p>
          <h3 className="text-2xl font-black text-slate-900 mt-2">₹{stats.totalAmount.toLocaleString("en-IN")}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR List */}
        <div className="lg:col-span-2 space-y-4">
          {qrCodes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <QrCode className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No QR Codes Yet</h3>
              <p className="text-sm text-slate-400 mt-1">Generate your first QR code to start receiving payments</p>
            </div>
          ) : (
            qrCodes.map((qr) => (
              <div
                key={qr.qrId}
                className={`bg-white rounded-2xl border p-5 transition-all hover:shadow-md ${selectedQR?.qrId === qr.qrId ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-100"}`}
                style={{ position: 'relative' }}
              >
                <div
                  style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}
                >
                  {qr.status === 'expired' && (
                    <button
                      onClick={() => handleDelete(qr.qrId)}
                      title="Delete expired QR"
                      className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div
                  onClick={() => setSelectedQR(qr)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{qr.name}</h3>
                          {getStatusBadge(qr.status)}
                          {qr.gatewayQrImageUrl && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-green-100 text-green-700 uppercase">
                              UPI QR
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-sm text-slate-400">{qr.qrId}</p>
                          {qr.gateway && (
                            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded capitalize">{qr.gateway}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900">₹{qr.amount.toLocaleString("en-IN")}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(qr.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected QR Preview */}
        <div className="lg:col-span-1">
          {selectedQR ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-6 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{selectedQR.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {selectedQR.gateway ? (
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
                        via {selectedQR.gateway}
                      </span>
                    ) : activeGateway ? (
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {activeGateway.label || activeGateway.gateway}
                      </span>
                    ) : null}
                    {activeGateway?.isTestMode && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Test Mode</span>
                    )}
                    {selectedQR.gatewayQrImageUrl && (
                      <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">Direct UPI Scan</span>
                    )}
                  </div>
                </div>
                {getStatusBadge(selectedQR.status)}
              </div>

              <div className="rounded-xl flex flex-col items-center justify-center mb-4">
                {selectedQR.gatewayQrImageUrl ? (
                  <>
                    {/* Gateway UPI QR — scanning directly opens UPI app */}
                    <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-inner">
                      <img
                        id={`qr-${selectedQR.qrId}`}
                        src={selectedQR.gatewayQrImageUrl}
                        alt={selectedQR.gateway ? `${selectedQR.gateway} QR` : 'Payment QR'}
                        className="w-full h-auto max-w-[240px]"
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    <div className="flex flex-col items-center mt-3 gap-1">
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Scan & Pay via UPI
                      </span>
                      <p className="text-[10px] text-slate-400 text-center">
                        Scan with any UPI app — payment opens directly, no link
                      </p>
                      {selectedQR.gateway && (
                        <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full capitalize">
                          via {selectedQR.gateway}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* No gateway QR image — show pay button instead of URL-based QR */}
                    <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-200 text-center w-full">
                      <QrCode className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-600">Gateway QR not available</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Use the button below to open the payment checkout
                      </p>
                      <a
                        href={getHostedPaymentUrl(selectedQR)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Payment Page
                      </a>
                    </div>
                    {/* Hidden SVG for download only (not for scanning) */}
                    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
                      <QRCodeSVG
                        id={`qr-${selectedQR.qrId}`}
                        value={getQRValue(selectedQR)}
                        size={240}
                        level="H"
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#000000"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mb-4">
                <p className="text-3xl font-black text-indigo-600">₹{selectedQR.amount.toLocaleString("en-IN")}</p>
                {selectedQR.status === "active" && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expires: {formatDate(selectedQR.expiresAt)}
                  </p>
                )}
              </div>

              {/* QR URL */}
              <div className="bg-slate-50 p-3 rounded-xl mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment URL</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={getHostedPaymentUrl(selectedQR)}
                    className="flex-1 bg-transparent text-xs text-slate-700 outline-none truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(getHostedPaymentUrl(selectedQR), selectedQR.qrId)}
                    className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {copiedId === selectedQR.qrId ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                {selectedQR.gatewayQrImageUrl && (
                  <button
                    onClick={() => downloadQR(selectedQR.qrId)}
                    className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedQR.qrId)}
                  className={`flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors ${!selectedQR.gatewayQrImageUrl ? 'col-span-2' : ''}`}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {/* Proceed to Pay / Share Payment Link */}
              {selectedQR.gatewayQrImageUrl ? (
                <>
                  {/* When gateway QR exists: show Download + Share payment link */}
                  <a
                    href={selectedQR.gatewayPaymentUrl || getHostedPaymentUrl(selectedQR)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 mt-3 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors w-full"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Share Payment Link
                  </a>
                </>
              ) : (
                <>
                  {/* When no gateway QR: prominent pay buttons */}
                  <a
                    href={getHostedPaymentUrl(selectedQR)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 mt-3 py-3 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors md:hidden w-full"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Proceed to Pay
                  </a>
                  <button
                    type="button"
                    className="hidden md:flex items-center justify-center gap-2 mt-3 py-3 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-colors w-full"
                    onClick={() => setShowGatewayModal(true)}
                  >
                    <ExternalLink className="w-5 h-5" />
                    Proceed to Pay
                  </button>
                </>
              )}
              {/* Payment Gateway Modal for desktop */}
              <PaymentGatewayModal
                url={selectedQR ? (selectedQR.gatewayPaymentUrl || getHostedPaymentUrl(selectedQR)) : ''}
                open={showGatewayModal}
                onClose={() => setShowGatewayModal(false)}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
              <QrCode className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400">Select a QR code to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Generate QR Code</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-xs font-bold text-slate-700 ml-1">Amount *</label>
                <div className="relative mt-2">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-lg font-bold"
                    autoFocus
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs font-bold text-slate-700 ml-1">QR Name (Optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Store Payment"
                  className="w-full mt-2 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 ml-1">Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Product purchase"
                  className="w-full mt-2 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              {/* Expiry */}
              <div>
                <label className="text-xs font-bold text-slate-700 ml-1">Expires In</label>
                <select
                  value={formData.expiryMinutes}
                  onChange={(e) => setFormData({ ...formData, expiryMinutes: e.target.value })}
                  className="w-full mt-2 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={1440}>24 hours</option>
                </select>
              </div>

              {/* Submit */}
              <button
                onClick={handleGenerate}
                disabled={generating || !formData.amount}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-5 h-5" />
                    Generate QR Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserQRCodes;