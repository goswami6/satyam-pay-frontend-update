import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
  Image,
  CreditCard,
  Save,
  ArrowLeft,
  Loader2,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { settingsAPI, getImageUrl, BASE_URL } from "../../utils/api";
import toast from "react-hot-toast";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    websiteName: "",
    websiteUrl: "",
    websiteEmail: "",
    websitePhone: "",
    websiteDescription: "",
    metaKeywords: "",
    logo: null,
    favicon: null,
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    commissionRate: 1,
    minWithdrawal: 50,
    maxWithdrawal: 500000,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.get();
      setSettings(response.data);
      if (response.data.logo) {
        setLogoPreview(`${BASE_URL}/uploads/settings/${response.data.logo}`);
      }
      if (response.data.favicon) {
        setFaviconPreview(`${BASE_URL}/uploads/settings/${response.data.favicon}`);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaviconFile(file);
      setFaviconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(settings).forEach((key) => {
        if (key !== "logo" && key !== "favicon" && key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt" && key !== "socialLinks") {
          formData.append(key, settings[key]);
        }
      });

      // Add files if selected
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      if (faviconFile) {
        formData.append("favicon", faviconFile);
      }

      await settingsAPI.update(formData);
      toast.success("Settings saved successfully!");
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Website Settings
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Manage your website configuration and payment settings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Website Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Website Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="websiteName"
                value={settings.websiteName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Rabbit Pay"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={settings.websiteUrl}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://rabbitpay.in.net"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Email
              </label>
              <input
                type="email"
                name="websiteEmail"
                value={settings.websiteEmail}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="info@rabbitpay.in.net"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Phone
              </label>
              <input
                type="tel"
                name="websitePhone"
                value={settings.websitePhone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+91 8449968867"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Description
              </label>
              <textarea
                name="websiteDescription"
                value={settings.websiteDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Secure payment gateway solution for businesses"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Keywords
              </label>
              <input
                type="text"
                name="metaKeywords"
                value={settings.metaKeywords}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="payment, gateway, secure, online, transactions"
              />
              <p className="text-xs text-gray-400 mt-1">Separate keywords with commas</p>
            </div>
          </div>
        </motion.div>

        {/* Media Files */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Media Files</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Logo
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="h-16 object-contain mb-2"
                      />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    )}
                    <span className="text-sm text-gray-600">
                      {logoPreview ? "Click to change" : "Click to upload"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      Recommended: 200x60px
                    </span>
                  </div>
                </label>
              </div>
              {settings.logo && !logoFile && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Current: {settings.logo}
                </p>
              )}
            </div>

            {/* Favicon Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Favicon
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*,.ico"
                  onChange={handleFaviconChange}
                  className="hidden"
                  id="favicon-upload"
                />
                <label htmlFor="favicon-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    {faviconPreview ? (
                      <img
                        src={faviconPreview}
                        alt="Favicon Preview"
                        className="h-10 w-10 object-contain mb-2"
                      />
                    ) : (
                      <Upload className="w-10 h-10 text-gray-400 mb-2" />
                    )}
                    <span className="text-sm text-gray-600">
                      {faviconPreview ? "Click to change" : "Click to upload"}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">
                      Recommended: 32x32px
                    </span>
                  </div>
                </label>
              </div>
              {settings.favicon && !faviconFile && (
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Current: {settings.favicon}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Address Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Shop No. 21, City Center Mall, Hooda Complex"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={settings.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Rohtak"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                name="state"
                value={settings.state}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Haryana"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={settings.country}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="India"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                name="zipCode"
                value={settings.zipCode}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="124001"
              />
            </div>
          </div>
        </motion.div>

        {/* Payment Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="commissionRate"
                  value={settings.commissionRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="1"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Platform fee on each transaction</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  name="minWithdrawal"
                  value={settings.minWithdrawal}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="50"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum withdrawal limit</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Withdrawal Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                <input
                  type="number"
                  name="maxWithdrawal"
                  value={settings.maxWithdrawal}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="500000"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Maximum withdrawal limit</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between pt-4"
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-medium"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default Settings;
