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

  const gatewayIcons = {
    razorpay: (
      <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
        <CreditCard className="w-6 h-6 text-white" />
      </div>
    ),
    payu: (
      <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
        <Zap className="w-6 h-6 text-white" />
      </div>
    ),
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
                  <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    Mode: {activeGateway.mode}
                  </span>
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
                    {gatewayIcons[gw.gateway]}
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900">
                          {gw.label}
                        </h3>
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
                    Gateway Key / ID
                  </label>
                  <input
                    type="text"
                    value={data.keyId || ""}
                    onChange={(e) =>
                      updateField(gw.gateway, "keyId", e.target.value)
                    }
                    placeholder={
                      gw.gateway === "razorpay"
                        ? "rzp_live_xxxxxxxx"
                        : "Your Merchant Key"
                    }
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-300 transition-all"
                  />
                </div>

                {/* Key Secret */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Gateway Secret / Salt
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
          <div className="grid md:grid-cols-2 gap-8">
            {/* Razorpay Setup */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  Razorpay Setup
                </h4>
              </div>
              <ol className="space-y-3">
                {[
                  {
                    text: "Go to Razorpay Dashboard",
                    link: "https://dashboard.razorpay.com",
                  },
                  { text: "Navigate to Settings → API Keys" },
                  { text: "Copy Key ID and Key Secret" },
                  { text: "Paste them in the form above" },
                  { text: "Enable the gateway and save" },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600 font-medium">
                      {step.text}
                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 ml-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* PayU Setup */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-green-600" />
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  PayU Setup
                </h4>
              </div>
              <ol className="space-y-3">
                {[
                  {
                    text: "Go to PayU Onboarding",
                    link: "https://onboarding.payu.in",
                  },
                  { text: "Get your Merchant Key and Salt" },
                  { text: "Copy Key and Salt values" },
                  { text: "Paste them in the form above" },
                  { text: "Enable the gateway and save" },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600 font-medium">
                      {step.text}
                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 ml-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewaySettings;
