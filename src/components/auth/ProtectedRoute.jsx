import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authUtils } from '../../utils/authUtils';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check if user is authenticated and token is not expired
  if (!authUtils.isAuthenticated() || !authUtils.refreshSessionIfNeeded()) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
