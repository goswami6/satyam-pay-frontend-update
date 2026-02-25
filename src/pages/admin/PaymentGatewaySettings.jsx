import { useState, useEffect } from "react";
import {
  Shield,
  Eye,
  EyeOff,
  Check,
  Loader,
  CreditCard,
  Zap,
  Info,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  QrCode,
} from "lucide-react";
import { gatewayAPI } from "../../utils/api";

const PaymentGatewaySettings = () => {
  const [gateways, setGateways] = useState([]);
  const [activeGateway, setActiveGateway] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [activating, setActivating] = useState(null);
  const [showSecrets, setShowSecrets] = useState({});
  const [editData, setEditData] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchGateways();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchGateways = async () => {
    try {
      setLoading(true);
      const response = await gatewayAPI.getAll();
      setGateways(response.data.gateways || []);
      setActiveGateway(response.data.activeGateway);

      // Initialize edit data
      const data = {};
      (response.data.gateways || []).forEach((g) => {
        data[g.gateway] = {
          keyId: g.keyId || "",
          keySecret: "",
          isEnabled: g.isEnabled,
          isTestMode: g.isTestMode,
        };
      });
      setEditData(data);
    } catch (error) {
      console.error("Error fetching gateways:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (gateway) => {
    try {
      setSaving((prev) => ({ ...prev, [gateway]: true }));
      const data = editData[gateway];
      const payload = {
        keyId: data.keyId,
        isEnabled: data.isEnabled,
        isTestMode: data.isTestMode,
      };
      if (data.keySecret) {
        payload.keySecret = data.keySecret;
      }
      await gatewayAPI.update(gateway, payload);
      setSuccessMsg(`${gateway.toUpperCase()} settings saved successfully!`);
      await fetchGateways();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving((prev) => ({ ...prev, [gateway]: false }));
    }
  };

  const handleSetActive = async (gateway) => {
    try {
      setActivating(gateway);
      const response = await gatewayAPI.setActive(gateway);
      setActiveGateway(response.data.activeGateway);
      setSuccessMsg(response.data.message);
      await fetchGateways();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to set active gateway");
    } finally {
      setActivating(null);
    }
  };

  const updateField = (gateway, field, value) => {
    setEditData((prev) => ({
      ...prev,
      [gateway]: { ...prev[gateway], [field]: value },
    }));
  };

  const toggleSecret = (gateway) => {
    setShowSecrets((prev) => ({ ...prev, [gateway]: !prev[gateway] }));
  };

  const getGatewayIcon = (gateway) => {
    if (gateway === "razorpay") {
      return (
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
      );
    }

    if (gateway === "payu") {
      return (
        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
          <Zap className="w-6 h-6 text-white" />
        </div>
      );
    }

    return (
      <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
        <CreditCard className="w-6 h-6 text-white" />
      </div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-0 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Payment Gateway Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure and manage your payment gateways
          </p>
        </div>
        <button
          onClick={fetchGateways}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl animate-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold text-emerald-800">
            {successMsg}
          </span>
        </div>
      )}

      {/* Active Gateway Banner */}
      {activeGateway && (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-indigo-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                Currently Active Payment Gateway
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-black">
                  {activeGateway.label}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    Gateway: {activeGateway.gateway.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${activeGateway.mode === "Live Mode"
                    ? "bg-emerald-400/30 text-emerald-100"
                    : "bg-amber-400/30 text-amber-100"
                    }`}>
                    Mode: {activeGateway.mode}
                  </span>
                </div>
                {/* Dynamic QR / Scan & Pay info */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[11px] font-semibold text-white/80 backdrop-blur-sm flex items-center gap-1.5">
                    <QrCode className="w-3.5 h-3.5" />
                    Dynamic QR — Scan & Pay supported
                  </span>
                  {activeGateway.mode === "Live Mode" && (
                    <span className="px-2 py-1 bg-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-200">
                      UPI QR Active
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-indigo-200 font-medium">
                  Last Updated
                </p>
                <p className="text-sm font-bold">
                  {formatDate(activeGateway.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Cards */}
      <div className="grid gap-6">
        {gateways.map((gw) => {
          const data = editData[gw.gateway] || {};
          const isGatewayActive = activeGateway?.gateway === gw.gateway;
          const isGatewayIntegrated =
            typeof gw.isIntegrated === "boolean"
              ? gw.isIntegrated
              : ["razorpay", "payu", "cashfree"].includes(gw.gateway);

          return (
            <div
              key={gw.gateway}
              className={`bg-white rounded-3xl border-2 shadow-xl overflow-hidden transition-all duration-300 ${isGatewayActive
                ? "border-indigo-200 shadow-indigo-100/50"
                : "border-slate-100 shadow-slate-100/50"
                }`}
            >
              {/* Card Header */}
              <div className="p-6 md:p-8 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {getGatewayIcon(gw.gateway)}
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900">
                          {gw.label}
                        </h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isGatewayIntegrated
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                            }`}
                        >
                          {isGatewayIntegrated ? "Integrated" : "Coming Soon"}
                        </span>
                        {isGatewayActive && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {gw.description}
                      </p>
                    </div>
                  </div>
                  {!isGatewayActive && gw.isEnabled && (
                    <button
                      onClick={() => handleSetActive(gw.gateway)}
                      disabled={activating === gw.gateway}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center gap-2"
                    >
                      {activating === gw.gateway ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Set Active
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Key ID */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {gw.keyIdLabel || "Gateway Key / ID"}
                  </label>
                  <input
                    type="text"
                    value={data.keyId || ""}
                    onChange={(e) =>
                      updateField(gw.gateway, "keyId", e.target.value)
                    }
                    placeholder={
                      gw.gateway === "razorpay"
                        ? "rzp_test_xxxxxxxx"
                        : `Enter ${gw.keyIdLabel || "gateway key"}`
                    }
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all"
                  />
                </div>

                {/* Key Secret */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {gw.keySecretLabel || "Gateway Secret / Salt"}
                  </label>
                  <div className="relative">
                    <input
                      type={showSecrets[gw.gateway] ? "text" : "password"}
                      value={data.keySecret || ""}
                      onChange={(e) =>
                        updateField(gw.gateway, "keySecret", e.target.value)
                      }
                      placeholder={
                        gw.keySecret
                          ? "••••••••••••••••••••••••"
                          : "Enter secret key"
                      }
                      className="w-full px-4 py-3.5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => toggleSecret(gw.gateway)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showSecrets[gw.gateway] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Keep this secret and secure. Leave blank to keep existing
                    secret.
                  </p>
                </div>

                {/* Toggles */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Enable Gateway */}
                  <div
                    onClick={() =>
                      updateField(gw.gateway, "isEnabled", !data.isEnabled)
                    }
                    className={`flex-1 flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.isEnabled
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-slate-50 border-slate-200"
                      }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Enable Gateway
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {data.isEnabled ? "Gateway is ON" : "Gateway is OFF"}
                      </p>
                    </div>
                    {data.isEnabled ? (
                      <ToggleRight className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-400" />
                    )}
                  </div>

                  {/* Test Mode */}
                  <div
                    onClick={() =>
                      updateField(gw.gateway, "isTestMode", !data.isTestMode)
                    }
                    className={`flex-1 flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.isTestMode
                      ? "bg-amber-50 border-amber-200"
                      : "bg-blue-50 border-blue-200"
                      }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {data.isTestMode ? "Test Mode" : "Live Mode"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {data.isTestMode
                          ? "Using test credentials"
                          : "Using live credentials"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${data.isTestMode
                        ? "bg-amber-200 text-amber-800"
                        : "bg-blue-200 text-blue-800"
                        }`}
                    >
                      {data.isTestMode ? "TEST" : "LIVE"}
                    </span>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleSave(gw.gateway)}
                    disabled={saving[gw.gateway]}
                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center gap-2 shadow-lg"
                  >
                    {saving[gw.gateway] ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Settings
                  </button>
                </div>

                {/* QR Scan & Pay Info */}
                {isGatewayActive && gw.isEnabled && !data.isTestMode && (
                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                    <QrCode className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-emerald-800">Dynamic QR — Scan & Pay Active</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Live mode is ON. When users generate dynamic QR codes, scanning them will <strong>directly open UPI app for payment</strong> — no URL prompt will appear. This works for {gw.label} gateway. Change to another gateway from admin panel to switch QR provider.
                      </p>
                    </div>
                  </div>
                )}
                {isGatewayActive && gw.isEnabled && data.isTestMode && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Test Mode — QR Scan Limited</p>
                      <p className="text-xs text-amber-700 mt-1">
                        In test mode, generated QR codes will open a checkout URL instead of direct UPI scan. Switch to <strong>Live Mode</strong> for real UPI QR scan-and-pay functionality.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Instructions */}
      <div className="bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Info className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Configuration Instructions
            </h3>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-6">
            {gateways.map((gw) => (
              <div key={`setup_${gw.gateway}`} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-slate-600" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    {gw.label}
                  </h4>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {gw.setupNote || "Use gateway dashboard to generate test credentials and configure here."}
                </p>

                <a
                  href={gw.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Open Docs
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          {/* Warning Note */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800">Important</p>
              <p className="text-xs text-amber-700 mt-1">
                Only one gateway can be active at a time. When you set a gateway
                as active, it will be used for all payment operations across the
                platform. Make sure your credentials are correct before going
                live.
              </p>
            </div>
          </div>

          {/* QR Scan-and-Pay Note */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-3">
            <QrCode className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-800">Dynamic QR — Scan & Pay</p>
              <p className="text-xs text-blue-700 mt-1">
                When a gateway is <strong>active</strong> and in <strong>Live Mode</strong>, dynamic QR codes generated by users will use the gateway's UPI QR API.
                Scanning these QR codes directly opens the UPI app for payment — <strong>no "Open URL?" prompt</strong>. This works for Razorpay, PayU, and Cashfree.
                Changing the active gateway here will immediately affect all new QR codes generated on the user page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewaySettings;
