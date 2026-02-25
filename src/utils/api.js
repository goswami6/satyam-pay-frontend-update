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
    const token = sessionStorage.getItem("token");
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
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ===============================

// Razorpay QR Link API
export const razorpayQRAPI = {
  createLink: (amount, description) => api.post("/qr/razorpay-create-link", { amount, description }),
};
// AUTH APIs
// ===============================
export const authAPI = {
  register: (data) => api.post("/users/register", data),
  login: (data) => api.post("/users/login", data),
  adminLogin: (data) => api.post("/users/admin-login", data),
  forgotPassword: (data) => api.post("/users/forgot-password", data),
  resetPassword: (token, data) => api.post(`/users/reset-password/${token}`, data),
  verifyResetToken: (token) => api.get(`/users/verify-reset-token/${token}`),
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
// API TOKEN APIs (Original - for general use)
// ===============================
export const apiTokenAPI = {
  getTokens: (userId) => api.get(`/users/api-tokens/${userId}`),
  generateToken: (userId, data) => api.post(`/users/api-tokens/${userId}`, data),
  deleteToken: (userId, tokenId) => api.delete(`/users/api-tokens/${userId}/${tokenId}`),
};

// ===============================
// PAYOUT API TOKEN APIs (With Admin Approval)
// ===============================
export const payoutApiTokenAPI = {
  // User APIs
  getTokens: (userId) => api.get(`/api-tokens/user/${userId}`),
  requestToken: (data) => api.post(`/api-tokens/request`, data),
  deleteToken: (tokenId) => api.delete(`/api-tokens/${tokenId}`),

  // Admin APIs
  getAllRequests: (status) => api.get(`/api-tokens/admin/all${status ? `?status=${status}` : ''}`),
  getRequest: (requestId) => api.get(`/api-tokens/admin/${requestId}`),
  approveRequest: (requestId, data) => api.put(`/api-tokens/admin/approve/${requestId}`, data),
  rejectRequest: (requestId, data) => api.put(`/api-tokens/admin/reject/${requestId}`, data),
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
// QR CODE APIs
// Note: gatewayQrImageUrl is returned by backend if available
export const qrCodeAPI = {
  generate: (data) => api.post("/qr/generate", data),
  generateStatic: (data) => api.post("/qr/generate-static", data),
  getUserQRCodes: (userId) => api.get(`/qr/user/${userId}`),
  getAdminAll: (params) => api.get("/qr/admin/all", { params }),
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

  // Admin APIs
  adminGetAll: () => api.get("/reports/admin/all"),
  adminGetStats: () => api.get("/reports/admin/stats"),
  adminGenerate: (data) => api.post("/reports/admin/generate", data),
};

// ===============================
// DASHBOARD APIs
// ===============================
export const dashboardAPI = {
  getStats: (userId) => api.get(`/dashboard/stats/${userId}`),
  getRecentTransactions: (userId, limit = 5) =>
    api.get(`/dashboard/recent-transactions/${userId}?limit=${limit}`),
  getBalanceSummary: (userId) => api.get(`/dashboard/balance-summary/${userId}`),
  getAdminStats: () => api.get("/dashboard/admin-stats"),
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
// PAYOUT REQUEST APIs
// ===============================
export const payoutRequestAPI = {
  // User/Vendor APIs
  createRequest: (data) => api.post("/payout-requests/request", data),
  getMyRequests: (params) => api.get("/payout-requests/my-requests", { params }),
  getRequestById: (id) => api.get(`/payout-requests/request/${id}`),
  cancelRequest: (id) => api.put(`/payout-requests/cancel/${id}`),
  
  // Admin APIs
  getAllRequests: (params) => api.get("/payout-requests/admin/all", { params }),
  approveRequest: (id, data) => api.put(`/payout-requests/admin/approve/${id}`, data),
  rejectRequest: (id, data) => api.put(`/payout-requests/admin/reject/${id}`, data),
  completeRequest: (id, data) => api.put(`/payout-requests/admin/complete/${id}`, data),
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
// WEBSITE SETTINGS APIs
// ===============================
export const settingsAPI = {
  get: () => api.get("/settings"),
  getPublic: () => api.get("/settings/public"),
  getPayment: () => api.get("/settings/payment"),
  update: (formData) => api.put("/settings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

// ===============================
// ENQUIRY/CONTACT FORM APIs
// ===============================
export const enquiryAPI = {
  // Public - Submit enquiry
  submit: (data) => api.post("/enquiry/submit", data),
  
  // Admin - Get all enquiries
  getAll: (params = {}) => api.get("/enquiry", { params }),
  
  // Admin - Get single enquiry
  getById: (id) => api.get(`/enquiry/${id}`),
  
  // Admin - Update enquiry status
  update: (id, data) => api.put(`/enquiry/${id}`, data),
  
  // Admin - Delete enquiry
  delete: (id) => api.delete(`/enquiry/${id}`),
  
  // Admin - Bulk delete
  bulkDelete: (ids) => api.post("/enquiry/bulk-delete", { ids }),
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
