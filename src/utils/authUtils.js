import { sessionManager } from '../API/authApi';

// Authentication utility functions
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return sessionManager.isLoggedIn();
  },

  // Get current user data
  getCurrentUser: () => {
    const session = sessionManager.getUserSession();
    return session ? session.user : null;
  },

  // Get auth token
  getToken: () => {
    return sessionManager.getAuthToken();
  },

  // Logout user
  logout: () => {
    sessionManager.clearUserSession();
  },

  // Get authorization header for API calls
  getAuthHeader: () => {
    const token = sessionManager.getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  // Check if token is expired (basic check)
  isTokenExpired: () => {
    const session = sessionManager.getUserSession();
    if (!session || !session.timestamp) return true;
    
    // Token expires after 24 hours (based on the JWT response structure)
    const tokenAge = Date.now() - session.timestamp;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    return tokenAge > twentyFourHours;
  },

  // Refresh session if needed
  refreshSessionIfNeeded: () => {
    if (authUtils.isTokenExpired()) {
      authUtils.logout();
      return false;
    }
    return true;
  }
};
