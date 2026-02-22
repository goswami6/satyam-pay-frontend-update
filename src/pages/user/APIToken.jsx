import { useState, useEffect } from "react";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
  Loader,
  ExternalLink,
  Lock,
  BookOpen,
  Download,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { apiTokenAPI } from "../../utils/api";

const APIToken = () => {
  const { getUserId } = useAuth();
  const userId = getUserId();

  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newToken, setNewToken] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [visibleSecrets, setVisibleSecrets] = useState({});

  useEffect(() => {
    fetchTokens();
  }, [userId]);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await apiTokenAPI.getTokens(userId);
      setTokens(response.data.tokens || []);
    } catch (error) {
      console.error("Error fetching tokens:", error);
    } finally {
      setLoading(false);
    }
  };

  const createToken = async () => {
    if (!tokenName.trim()) return alert("Please enter a token name");

    try {
      setCreating(true);
      const response = await apiTokenAPI.generateToken(userId, { name: tokenName, mode: "live" });

      setNewToken(response.data.token);
      setTokens([response.data.token, ...tokens]);
      setTokenName("");
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create keys");
    } finally {
      setCreating(false);
    }
  };

  const deleteToken = async (tokenId) => {
    if (!confirm("Are you sure you want to revoke this API key pair?")) return;

    try {
      await apiTokenAPI.deleteToken(userId, tokenId);
      setTokens(tokens.filter((t) => t._id !== tokenId));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete keys");
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSecretVisibility = (id) => {
    setVisibleSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const maskSecret = (secret) => {
    if (!secret) return "";
    return secret.substring(0, 8) + "••••••••••••••••" + secret.substring(secret.length - 4);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            API Keys
          </h1>
          <p className="text-slate-500 mt-1">
            Generate and manage your API Key ID and Secret Key for secure integration.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/api-documentation"
            target="_blank"
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            API Documentation
          </Link>
          <a
            href="https://www.postman.com/downloads/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Postman
          </a>
        </div>
      </div>

      {/* New Keys Created Alert */}
      {newToken && (
        <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-emerald-800 text-lg">
                API Keys Generated Successfully!
              </h3>
              <p className="text-sm text-emerald-600 mt-1">
                <strong>Important:</strong> Copy your Secret Key now. For security reasons, we won't show the full secret key again.
              </p>

              <div className="mt-4 space-y-3">
                {/* Key ID */}
                <div className="bg-white p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key ID</p>
                      <code className="text-sm font-mono text-slate-800 mt-1 block">{newToken.keyId}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(newToken.keyId, "new-key")}
                      className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                    >
                      {copiedId === "new-key" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Secret Key */}
                <div className="bg-white p-4 rounded-xl border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Secret Key (Save this now!)
                      </p>
                      <code className="text-sm font-mono text-slate-800 mt-1 block break-all">{newToken.secretKey}</code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(newToken.secretKey, "new-secret")}
                      className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                    >
                      {copiedId === "new-secret" ? (
                        <CheckCircle className="w-4 h-4 text-red-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-red-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setNewToken(null)}
                className="mt-4 text-sm text-emerald-700 font-medium hover:underline"
              >
                I've saved my keys, dismiss this
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mb-6">
        <Link
          to="/api-documentation"
          target="_blank"
          className="px-4 py-2 rounded-xl text-sm font-bold transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          View Full Guide
          <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tokens List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Your API Keys</h2>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Generate New Keys
              </button>
            </div>

            {tokens.length === 0 ? (
              <div className="p-12 text-center">
                <Key className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-bold text-slate-700">No API Keys</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Generate your first API key pair to start integrating
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {tokens.map((token) => (
                  <div key={token._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900">{token.name}</h3>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${token.status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                            }`}>
                            {token.status === "active" ? "Active" : "Revoked"}
                          </span>
                        </div>

                        {/* Key ID */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 w-20">Key ID:</span>
                          <code className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {token.keyId}
                          </code>
                          <button
                            onClick={() => copyToClipboard(token.keyId, `key-${token._id}`)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                          >
                            {copiedId === `key-${token._id}` ? (
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </div>

                        {/* Secret Key */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 w-20">Secret:</span>
                          <code className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                            {visibleSecrets[token._id] ? token.secretKey : maskSecret(token.secretKey)}
                          </code>
                          <button
                            onClick={() => toggleSecretVisibility(token._id)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                          >
                            {visibleSecrets[token._id] ? (
                              <EyeOff className="w-3 h-3 text-slate-400" />
                            ) : (
                              <Eye className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                          <button
                            onClick={() => copyToClipboard(token.secretKey, `secret-${token._id}`)}
                            className="p-1 hover:bg-slate-200 rounded transition-colors"
                          >
                            {copiedId === `secret-${token._id}` ? (
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-400" />
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-slate-400">
                          Created: {formatDate(token.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteToken(token._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Guide Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Quick Start</h3>
            </div>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span className="text-slate-600">Generate API Key ID & Secret</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span className="text-slate-600">Use Basic Auth with Key ID as username & Secret as password</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span className="text-slate-600">Make API requests to create orders</span>
              </li>
            </ol>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              Security Tips
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• Never expose Secret Key in frontend code</li>
              <li>• Use environment variables for storage</li>
              <li>• Rotate keys periodically</li>
              <li>• Revoke compromised keys immediately</li>
            </ul>
          </div>

          <a
            href="https://www.postman.com/downloads/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-orange-500 text-white p-4 rounded-2xl font-bold hover:bg-orange-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Postman
          </a>
        </div>
      </div>

      {/* Create Token Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-black text-slate-900 mb-2">
              Generate API Keys
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Create a new Key ID and Secret Key pair for API authentication.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 ml-1">
                  Key Name
                </label>
                <input
                  type="text"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g. Production API, Test Server"
                  className="w-full mt-2 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  autoFocus
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setTokenName("");
                  }}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createToken}
                  disabled={creating || !tokenName.trim()}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      Generate Keys
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIToken;
