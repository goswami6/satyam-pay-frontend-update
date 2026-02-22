import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check login on refresh (use sessionStorage for tab-specific auth)
  useEffect(() => {
    const sessionToken = sessionStorage.getItem("token");
    const sessionUser = sessionStorage.getItem("user");

    if (sessionToken && sessionUser) {
      try {
        setToken(sessionToken);
        setUser(JSON.parse(sessionUser));
      } catch (error) {
        console.error("Invalid user in sessionStorage");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // ✅ Login (use sessionStorage so each tab has separate auth)
  const login = (authToken, userData) => {
    try {
      // Store in sessionStorage (tab-specific, not shared)
      sessionStorage.setItem("token", authToken);
      sessionStorage.setItem("user", JSON.stringify(userData));

      // Update state
      setToken(authToken);
      setUser(userData);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // ✅ Logout
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // ✅ Get auth header for API calls
  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ✅ Check if user is authenticated
  const isAuthenticatedUser = () => {
    return !!user && !!token;
  };

  // ✅ Check if user has admin role
  const hasAdminAccess = () => {
    return user?.role === "admin";
  };

  // ✅ Check if user has user role
  const hasUserAccess = () => {
    return user?.role === "user";
  };

  // ✅ Get user ID
  const getUserId = () => {
    return user?._id;
  };

  // ✅ Get user balance
  const getUserBalance = () => {
    return user?.balance || 0;
  };

  // ✅ Update user data
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    sessionStorage.setItem("user", JSON.stringify(newUserData));
  };

  const value = {
    // State
    user,
    token,
    loading,

    // Helper properties
    role: user?.role,
    isAuthenticated: !!user,

    // Methods
    login,
    logout,
    updateUser,
    getAuthHeader,
    isAuthenticatedUser,
    hasAdminAccess,
    hasUserAccess,
    getUserId,
    getUserBalance,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
