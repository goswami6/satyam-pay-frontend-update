import axios from "axios";

// Base URL Configuration
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_URL = `${BASE_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ===============================
// AUTH APIs
// ===============================
export const authAPI = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  adminLogin: (data) => api.post("/users/admin-login", data),
};

// ===============================
// USER APIs
// ===============================
export const userAPI = {
  // Profile
  getProfile: (userId) => api.get(`/users/profile/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/profile/${userId}`, data),

  // Balance
  getBalance: (userId) => api.get(`/users/balance/${userId}`),

  // Get single user
  getUser: (userId) => api.get(`/users/${userId}`),

  // Admin - All users
  getAllUsers: () => api.get("/users/all"),
  toggleUserStatus: (userId) => api.get(`/users/toggle-status/${userId}`),
};

// ===============================
// KYC APIs
// ===============================
export const kycAPI = {
  // User
  getStatus: (userId) => api.get(`/users/kyc-status/${userId}`),
  submit: (userId, formData) =>
    api.post(`/users/kyc/${userId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin
  getPendingKYC: () => api.get("/users/kyc-pending/all"),
  approve: (userId) => api.put(`/users/kyc-approve/${userId}`),
  reject: (userId, data) => api.put(`/users/kyc-reject/${userId}`, data),
};

// ===============================
// API TOKEN APIs
// ===============================
export const apiTokenAPI = {
  getTokens: (userId) => api.get(`/users/api-tokens/${userId}`),
  generateToken: (userId, data) => api.post(`/users/api-tokens/${userId}`, data),
  deleteToken: (userId, tokenId) => api.delete(`/users/api-tokens/${userId}/${tokenId}`),
};

// ===============================
// BANK APIs
// ===============================
export const bankAPI = {
  getBanks: (userId) => api.get(`/bank/${userId}`),
  addBank: (data) => api.post("/bank", data),
  deleteBank: (bankId) => api.delete(`/bank/${bankId}`),
};

// ===============================
// TRANSACTION APIs
// ===============================
export const transactionAPI = {
  getTransactions: (userId) => api.get(`/transactions/${userId}`),
  getAllTransactions: () => api.get("/transactions"),
};

// ===============================
// PAYMENT APIs
// ===============================
export const paymentAPI = {
  // Orders
  createOrder: (data) => api.post("/payment/create-order", data),
  verifyPayment: (data) => api.post("/payment/verify", data),

  // Payment Links
  generateLink: (data) => api.post("/payment/generate-link", data),

  // Payout
  withdraw: (data) => api.post("/payment/withdraw", data),

  // Bulk Upload
  bulkUpload: (formData) =>
    api.post("/payment/bulk-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin
  getAdminWithdrawals: () => api.get("/payment/admin/withdrawals"),
  approveWithdrawal: (id) => api.post(`/payment/admin/approve/${id}`),
  rejectWithdrawal: (id) => api.post(`/payment/admin/reject/${id}`),
};

// ===============================
// WITHDRAW APIs
// ===============================
export const withdrawAPI = {
  request: (data) => api.post("/withdraw/request", data),

  // Admin
  getAll: (type = "withdrawal") => api.get(`/withdraw/admin/all?type=${type}`),
  approve: (id) => api.post(`/withdraw/admin/approve/${id}`),
  reject: (id) => api.post(`/withdraw/admin/reject/${id}`),
};

// ===============================
// BULK PAYOUT APIs
// ===============================
export const bulkPayoutAPI = {
  getAll: () => api.get("/bulk/bulk-payouts"),
  approve: (id) => api.put(`/bulk/bulk-payouts/${id}/approve`),
  reject: (id) => api.put(`/bulk/bulk-payouts/${id}/reject`),
  download: (payoutId) =>
    api.get(`/bulk/bulk-payouts/${payoutId}/download`, {
      responseType: "blob",
    }),
};

// ===============================
// QR CODE APIs
// ===============================
export const qrCodeAPI = {
  generate: (data) => api.post("/qr/generate", data),
  generateStatic: (data) => api.post("/qr/generate-static", data),
  getUserQRCodes: (userId) => api.get(`/qr/user/${userId}`),
  delete: (qrId) => api.delete(`/qr/${qrId}`),
};

// ===============================
// REPORT APIs
// ===============================
export const reportAPI = {
  getUserReports: (userId) => api.get(`/reports/user/${userId}`),
  getStats: (userId) => api.get(`/reports/stats/${userId}`),
  generate: (data) => api.post("/reports/generate", data),
  download: (reportId) =>
    api.get(`/reports/download/${reportId}`, {
      responseType: "blob",
    }),
  delete: (reportId) => api.delete(`/reports/${reportId}`),
};

// ===============================
// DASHBOARD APIs
// ===============================
export const dashboardAPI = {
  getStats: (userId) => api.get(`/dashboard/stats/${userId}`),
  getRecentTransactions: (userId, limit = 5) =>
    api.get(`/dashboard/recent-transactions/${userId}?limit=${limit}`),
  getBalanceSummary: (userId) => api.get(`/dashboard/balance-summary/${userId}`),
};

// ===============================
// SUPPORT CHAT APIs
// ===============================
export const supportAPI = {
  getChat: (userId) => api.get(`/support/chat/${userId}`),
  sendMessage: (userId, message) =>
    api.post(`/support/chat/${userId}/send`, { message }),
  getUnreadCount: (userId) => api.get(`/support/unread/${userId}`),
  deleteMessage: (userId, messageId) =>
    api.delete(`/support/chat/${userId}/message/${messageId}`),
  // Admin APIs
  getAllChats: (status = "all") =>
    api.get(`/support/admin/chats?status=${status}`),
  getAdminChat: (chatId) => api.get(`/support/admin/chat/${chatId}`),
  sendAdminMessage: (chatId, message) =>
    api.post(`/support/admin/chat/${chatId}/send`, { message }),
  sendAdminFileMessage: (chatId, formData) =>
    api.post(`/support/admin/chat/${chatId}/send-file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sendFileMessage: (userId, formData) =>
    api.post(`/support/chat/${userId}/send-file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateChatStatus: (chatId, status) =>
    api.patch(`/support/admin/chat/${chatId}/status`, { status }),
  deleteAdminMessage: (chatId, messageId) =>
    api.delete(`/support/admin/chat/${chatId}/message/${messageId}`),
};

// ===============================
// GATEWAY SETTINGS APIs
// ===============================
export const gatewayAPI = {
  getAll: () => api.get("/gateway"),
  update: (gateway, data) => api.put(`/gateway/${gateway}`, data),
  setActive: (gateway) => api.post(`/gateway/set-active/${gateway}`),
  getActive: () => api.get("/gateway/active"),
};

// ===============================
// HELPER FUNCTIONS
// ===============================

// Get image URL for uploaded files
export const getImageUrl = (path) => {
  if (!path) return "";
  return `${BASE_URL}/uploads/${path}`;
};

// Export base URL for external use
export { BASE_URL, API_URL };

// Default export
export default api;
